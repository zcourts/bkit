define('bkit/Resizable',
    [
        'module',
        'jquery',
        'bkit/Mixin',
        'bkit/Dispatchable',
        'bkit/Displayable',
        'bkit/Widget'
    ], function (module, $, Mixin, Dispatchable, Displayable, Widget) {
        /**
         * Represents a DOM widget whose size can change
         * @mixin
         * @mixes Dispatchable
         * @mixes Displayable
         * @mixes Widget
         * @global
         * @memberof dom
         */
        function Resizable() {
        }

        Resizable.prototype.type = module.id;

        /**
         * @namespace dom
         */
        Resizable.prototype.namespace = 'dom';

        Resizable.prototype.init = function (self) {
            self.event.create('resized');
        };

        /**
         * Sets size of the DOM node
         * @param self
         * @param width the new width of the object
         * @param height the new height of the object
         * @memberof Resizable
         */
        Resizable.prototype.setSize = function (self, width, height) {
            this.element.width(width).height(height);
        };

        /**
         * Sets the width of the DOM now
         * @param self
         * @param width the new width of the object
         * @memberof Resizable
         */
        Resizable.prototype.setWidth = function (self, width) {
            this.element.width(width);
        };

        /**
         * Sets the height of the DOM node
         * @param self
         * @param height the new height of the object
         * @memberof Resizable
         */
        Resizable.prototype.setHeight = function (self, height) {
            this.element.height(height);
        };

        return Mixin([Widget, Dispatchable, Displayable], Resizable);
    });
