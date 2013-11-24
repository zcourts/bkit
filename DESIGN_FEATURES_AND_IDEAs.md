# BKit - Bootstrap Toolkit

BKit is a JavaScript toolkit which provides a set of components for building advanced client side user interfaces.
BKit has 3 major set of components:

1. Widgets (Two types DOM Widgets aka dowi and abstractions)
2. Layouts
3. Views

At the base of all 3 is WiKit. WiKit is the base class which provides common functionality for all widgets.
All UI related classes are sub-classes of WiKit.

WiKit defines the basis needed for everything else by using JS-Signals for communication.

# Design choices

Convinced on Object blah for explanation see http://davidwalsh.name/javascript-objects-deconstruction
mixin! plugin uses ' at the end of a mixin to denote that if a function from this mixin is already defined on the target
object then this mixin's version of the function should over write the existing one.

For example if defining an object Abc and mixing in Def = {a:function(){}} and Ghi = {a:function(){}}
To over write Def's definition of a with Ghi's Abc should be defined as

define('namespace/Abc',["mixin!namespace/Def","mixin!namespace/Ghi'"],