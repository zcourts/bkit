define('bkit/Movable',
    [
        'module',
        'jquery',
        'bkit/Mixin',
        'bkit/Dispatchable',
        'bkit/Displayable',
        'bkit/Widget'
    ], function (module, $, Mixin, Dispatchable, Displayable, Widget) {
        /**
         * Represents a DOM widget whose position can change
         * @mixin
         * @mixes Dispatchable
         * @mixes Displayable
         * @mixes Widget
         * @global
         * @memberof dom
         */
        function Movable() {
        }

        Movable.prototype.type = module.id;

        /**
         * @namespace dom
         */
        Movable.prototype.namespace = 'dom';

        Movable.prototype.init = function (self) {
            self.event.create('moved');
        };

        /**
         * Gets the current position of this element
         * @param self
         * @memberof Movable
         * @returns {Object} an object with top and left properties indicating the top and left offsets of the dom element
         * e.g. {top:10,left:30}
         */
        Movable.prototype.position = function (self) {
            return this.element.position();
        };

        /**
         * Gets the DOM element for this object
         * @param self
         * @memberof Movable
         * @returns {jQueryElement} returns a jQuery wrapped DOM element. i.e. you can call any jQuery method directly
         * without wrapping it in $()
         */
        Movable.prototype.getElement = function (self) {
            return this.element;
        };

        return Mixin([Widget, Dispatchable, Displayable], Movable);
    });
