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
