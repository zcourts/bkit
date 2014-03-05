define('bkit/Displayable',
    [
        'module',
        'jquery',
        'bkit/Mixin',
        'bkit/Dispatchable',
        'bkit/Widget'
    ], function (module, $, Mixin, Dispatchable, Widget) {
        /**
         * Represents a widget which can be added to the DOM
         * It isolates the DOM element it contains by storing it in the namespace so that only functions
         * within the 'dom' namespace have access to it.
         * @mixes Dispatchable
         * @mixes Widget
         * @mixin
         * @global
         * @memberof dom
         */
        function Displayable() {
        }

        Displayable.prototype.type = module.id;

        /**
         * @namespace dom
         */
        Displayable.prototype.namespace = 'dom';
        Displayable.prototype.defaults = {dom: {element: null}};

        Displayable.prototype.init = function (self) {
            this.element = $(self.options.dom.element);
        };

        /**
         * Sets the DOM node which this displayable object manages.
         * @param self
         * @param el any valid DOM object or JQuery selector
         * @memberof Displayable
         */
        Displayable.prototype.setElement = function (self, el) {
            this.element = $(el);
        };

        /**
         *
         * @param self
         */
        Displayable.prototype.render = function (self) {
        };

        Displayable.prototype.hide = function (self, k) {
        };

        return Mixin([Widget, Dispatchable], Displayable);
    });
