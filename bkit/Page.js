define('bkit/Page',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/Dispatchable',
        'bkit/Widget'
    ],
    function (module, _, Mixin, Dispatchable, Widget) {
        /**
         * Represents a view in an application
         * @mixes Widget
         * @mixes Dispatchable
         * @global
         * @constructor
         */
        function Page() {
        }

        Page.prototype.type = module.id;
        /**
         * @namespace app
         */
        Page.prototype.namespace = 'app';
        Page.prototype.defaults = {route: false};

        /**
         * @memberof Page
         */
        Page.prototype.init = function (self) {
            if (!_.isString(self.options.route) && !_.isRegExp(self.options.route)) {
                throw new Error('A page must have a route which must be a String or RegExp');
            }
        };

        return Mixin([Widget, Dispatchable], Page);
    });
