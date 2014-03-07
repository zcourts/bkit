# BKit - Bootstrap Toolkit

BKit is a JavaScript toolkit which provides a set of components for building advanced client side user interfaces.
BKit has 3 major set of components:

1. Widgets
2. Layouts
3. Views

## Design and Conventions

BKit is designed with the idea that you create a data model for a domain and then decide what behaviour it should have.
"Mixins" are used to support this philosophy.
For example if you were designing a button, the suggested approach is to think about what data a button needs.
Let's say every button has a label, size and colour. Size and colour are optional.
i.e.
var Button =
{
    label: "Button",
    width: "5em",
    height:"1.5em",
    colour:"#000"
}

What does a button do? What events does it provide or listen to?
It's displayable, i.e. it can be added, moved and removed from the DOM
It's Resizable, i.e. it's size can change
It has Settable properties i.e. label can be set to a different value
It is "Mouseable" i.e. it responds to mouse events such as click, hover or mouse move etc
It is "Touchable" i.e. it responds to touch events
It is "Keyable" i.e. it responds to keyboard events (key up,down,press,release etc)

These capture some of the main some of the main properties of a potential button widget.
Each of these "able" names can be thought of as a set of common behaviour that is re-usable and applicable to many
types of widgets.
"able" can generally be taken to mean "able to" i.e anything with this mixin is able to have the given behaviour.
Words with this suffix are "usually" adjectives aka "describing" words.

Granted the words created by suffixing able doesn't always make sense or form "real" words but it's a convention that
re-enforces the design so it's used in most places unless it sounds really stupid in which case something more appropriate is used.
If a "real" adjective does exist for a given word whether it ends with able or not this adjective is used for the mixin's name.

By isolating behaviour from data BKit promotes re-usability making it very compact and generic.

## Class vs Mixin - Documentation

In general (especially in documentation) a difference between a "Class" and a "Mixin" is made.
Firstly, this is only an idealism,there is technically no reason why a module documented as a class cannot be mixed in
and likewise there is no reason a module documented as a mixin cannot be treated as a class.

So why do it? It has been done because generally speaking, a "Mixin" should be a small module that is able to add a behaviour
or a set of behavioural traits to an object/class. While a "Class" is meant as a module that is instanciated with the new
keyword, or used inline.

This convention is adopted to try and make it easier to see which modules are meant to be used as objects against those
meant to be mixed into others. However, there are cases where there is overlap and it makes just as much sense to use a module
directly as it does to mix it into another.

To document a module as a Mixin, add the @mixin annotation to the module's constructor. To document a module as a Class
add the @constructor annotation. In all cases, the @global annotation is required for JSDoc to recognise a requirejs
module as being globally accessible.

Unfortunately JSDoc doesn't automatically document a function added to another function's prototype as being a method of
said function. To document a function as a method, use the @memberof annotation

## Namespaces

Taking the approach of including mixed in behaviour means it is possible for multiple behaviours to have the same function name.
This would create a clash on the our data objects. To avoid this, every Mixin has a namespace.
Any Mixin without a namespace will cause the mixin attempt to fail.
For example, if we have a widget Button (as above) and we mixed in Mouseable and Touchable.
These two mixins could have a "pressed" and "release" event that would conflict. By using a namespace they can be accessed as:
Button.touch.pressed
Button.touch.released
Button.mouse.pressed
Button.mouse.released

This means that the data properties of Button should not have any names directly on the object that clashes with a mixin.
To that end, all properties set with Button.set is placed under the field "fields".
All standard widgets in BKit use the Widget.attr.set and Widget.attr.get functions where attr is the namespace for Settable.

### Multi-level namespaces
Multi-level namespaces are supported. A Widget can define it's name space as 'user.touch' and the Mixin will create
the user namespace if it doesn't exist and add touch to it. Any functions defined by a widget is then available under the
user.touch namespace. The implications of this design is briefly covered below.


Anything added to fn.prototype is shared between all objects created from fn. So modifying this.arg on a or b
results in the value being set on both a and b. Rarely if ever is this the desired effect.

### Closure.self

It is common for JS users to create a temporary variable and assign 'this' to it. This allows them to ensure they use the
correct context within closures. This is also a viable solution to enable multi-level namespaces.
BKit automatically injects an object as the first parameter of __every top level function__ of a namespace.
i.e. If a widget Button as a namespace 'widget' then all functions mixed into 'widget' namespace will have an extra argument injected
as the first parameter. This object should be treated as the context. This is done because there is no guarantee that
'this' within a function refers to the same context, in fact it is unlikely and by design, 'this' should always refer to
a 'Namespace' constructor. If a function takes no argument, the context object is still injected so a no-arg function
becomes a function which takes a single parameter, the context.

### this VS self

Multi-level namespaces come with one further advantage. __Isolation__! Every namespace is isolated on a per instance basis.
i.e. Given a widget Button under the namespace touch it has a function called pressed i.e. Button.touch.pressed.
when the pressed function is called, "this" inside the function refers to the namespace "touch". This means that
if a widget makes an assignment such as this.name = 'Courtney' and in the mouse namespace the pressed function also makes
an assignment such as this.name = 'Robinson'. Referencing this.name will return 'Courtney' to any function in the "touch"
namespace and return 'Robinson' to any function within the "mouse" namespace.

Contrary to the above point, if both functions from different namespaces does the assignment self.name. The value returned
depends on which function did the assignment last. Where self is the first argument that was automatically injected to each function.
A long winded way of saying self is shared across all namespaces while each namespace is isolated.

### Benefits & Tradeoff

Namespaces are a powerful and fundamental design feature. Not only are they incredibly useful in their own right, they
enhance the usefulness of Mixins greatly.
One may wonder what is being traded in order to support the functionality offered by multi-level namespaces. The answer
is invocation speed. While it's not a noticeable trade off it is the biggest.
Mixins are done for every instanciation of a widget and hence Namespaces are created on each invocation.
There are reasons why Mixin can't be done once at a function prototype level and has to be done for each instance.
Mainly that namespaces would become very tricky since a namesapce would be defined on the prototype of a function/widget
any sharing would mean that __all__ instances of a widget share the same properties.

## Constructor

Function "contructors" are only useful for debugging by helping to identify the type of an object.
They should not be used to perform initialization. An init method should be provided instead.
Constructors are not guaranteed to be invoked at all. In fact, most aren't. When a mixin happens, only the constructor
of the last function mixed in is invoked with the new operator and this may change should a better approach be found.
A constructor is never given any arguments. This is to discourage the temptation to attempt to initialize anything
in the constructor.

### Order of initialization
All mixins that provide an init function on their prototype will have the init function invoked.
If a widget is defined such that [Widget1,Widget2],Widget3 are the parameters to the mixin op.
The init method of Widget1 is called first, followed by Widget2's and then Widget3's.

The option object is always present, if none is supplied by the user defaults is taken from all the mixin's prototypes and merged
if no mixin provides a default and the user doesn't provide any then an empty object is set on the context as self.options.

##### Default options

When a widget is defined, it can provide a default options object on it's prototype by having an attribute named "defaults"
This default is used if no user options are provided on initialization.
If a user option is provided, it is merged with the defaults.
If multiple mixins provide defaults then all defaults are merged. The mixin added last takes precedence in case of a collision
in the defaults.
The user's options takes precedence over any defaults.
The final options object is available on self.options where self is the context injected into every function.

## Example Mixin

```javascript

//example 1

define('bkit/dowi/MyWidget',
    [
        'module',
        'bkit/Mixin',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, Widget) {
     //create a function only for it's constructor and prototype
     function MyWidget() {
     }
     // namespace and type are required. namespace is enforced, as in mixin fails if it isn't provided
     // using 'this' as the namespace puts all functions on MyWidget's prototype on the main object, NOT under a namespace
     //called this, this is the only 'special case' to support situations where a namespace isn't ideal
     MyWidget.prototype.namespace = 'this'; //in general this should be something like 'touch'
     MyWidget.prototype.type = module.id;

     //optionally provide an init function that can be used for initialization
     MyWidget.prototype.init = function (self) {
         self.options.label = 'My Widget';
     };

     MyWidget.prototype.hello = function(self, arg1, arg2){
     //self refers to the shared context, arg1 and arg2 are arguments the function would otherwise need to do it's job
     //this function is still called using MyWidget.hello('arg1','arg2'), self is injected automatically.
     }

     return Mixin([Widget], MyWidget);
    });

//example 2

define('bkit/dowi/SecondWidget',
    [
        'module',
        'bkit/Mixin',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, Widget) {
     function SecondWidget() {
     }
     //put these functions under the touch namespace
     SecondWidget.prototype.namespace = 'touch';
     SecondWidget.prototype.type = module.id;

     SecondWidget.prototype.pressed = function(self, e){
        //do something fancy with e
     }

     return Mixin([Widget], SecondWidget);
    });

```
## 10K ft design

BKit is designed to work the way a typical application does. At least in terms of how it is structured.
The following broad categories/types are common:

* `Application`
* `Page` (can contain other pages i.e. sub-pages)
* `Widget`/Component - There are several widgets, these can themselves be categorized but common ones are
    `Container`, `DataTable`, `ButtonGroup`, `Button`, etc
* `Router`

At the outter most layer is an `Application`. This is always the entry point for any URL.
An application contains one or more pages.
Each `Page` in turn can contain one or more `Widget`s.
Each page can be reached by a unique URL, be opened by triggering an event with the page's unique identifier or by passing
the object representing the page.
A `Page` can contain one or more `Container`s.
A container is a __layout component__ which determines it's own size and position as well as the size and position of it's
__direct children__. This means multiple containers can be next to each other if their individual sizing allows for it.
A widget is placed inside a container or directly inside a page (so layout is left to the browser/css of the page's container element).
Widgets can be nested. If a `Widget` is a direct child of another widget the widget's position/layout is determined by it's parent widget.
The ideal/preferred way of nesting widgets is to place a layout container in the widget within which further widgets are placed
thereby letting the container widget be responsible for the layout of the nested widgets.

The `Router` is attached to an `Application`. There is a single router for the entire application.
Where HTML5 URL manipulation is available it is preferred, as a fall back the hash bang syntax is used i.e. url.com/app#!some/path
If HTML5 URL manipulation is unavailable and a request URL comes in as url.com/app/some/path the router will change it to url.com/app#!some/path
and all subsequent modification of the URL will only change the hash component of the URL.
The router is also responsible for setting URL history if it can. This is done for any Page which does not have it's history
property disabled.

## Events

The entire toolkit is event driven allowing 1 to many event notifications.
To help avoid issues caused by using string names as events BKit requires an existing function in order to subscribe to
and event.
Because of this, all widgets must register all events it intends to emit. Furthermore, the namespace convention described above
enables the ability to address events in a reader friendly form i.e. Button.touch.tapped.listen() or Button.touch.tapped.disptach(arg1,arg2)
An interested party can therefore use an event by

```javascript

myFunc = function(arg1,arg2,...){}
//subscribe to tapped event
Button.touch.tapped.subscribe(myFunc)
//trigger the tapped event with n args
// NOTE: events like this are automatically dispatched with user interaction but can also be done manually
Button.touch.tapped.disptach(arg1,arg2,...)
//later unsubscribe from an event
Button.touch.tapped.unsubscribe(myFunc)

//where Button is a Button instance, not the Mixin
```
## Documentation

Documentation is very important. Especially in cases like BKit where so much is being generated automatically.
BKit's documentation is available at [http://code.zcourts.com/bkit](http://code.zcourts.com/bkit).
It is automatically generated from the code base using JSDoc.
The aim is to have 100% coverage on documentation of all modules, methods, properties and events.
To generate the docs there is a jsdoc.json file in the repo. Use the following

```shell
jsdoc README.md -c jsdoc.json -t ~/projects/docstrap/template -d ../bkit-docs
```
__~/projects/docstrap/template__ is the directory to the JSDoc template. Using the [Docstrap template](https://github.com/terryweiss/docstrap).
__../bkit-docs__ is a duplicate of the bkit repo, checkedout to the gh-pages branch.
Once done, commit and push to gh-pages branch of the repo.
