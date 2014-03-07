/**
 * @namespace
 */
define('bkit/Widget',
    [
        'module',
        'signals',
        'bkit/Util'
    ],
    function (module, Signal, Util) {
        /**
         * @mixin
         * @global
         */
        function Widget() {
        }

        Widget.prototype.type = module.id;
        Widget.prototype.namespace = 'this';
        Widget.prototype.defaults = {};

        Widget.prototype.init = function (self) {
            //generate the hash code for this widget
            var allMixinNames = "";
            _.each(self.mixins, function (self, val, key) {
                allMixinNames += key;
            });

            self.hashCode = Util.hash(allMixinNames);
            //and the instance id
            self.instance_id = Util.hash(new Date().getTime() + "" + Math.random());
        };

        /**
         * Check if the given object is of the specified type.
         * An object is of a type if that type was mixed into the object
         * @param obj the type to check for, typical of the form namespace/package/ModuleName e.g.
         * the string bkit/dowi/Button or the Button constructor function, if obj is not a string or a function
         * then instanceof is used to test it against all mixins until the first one which returns true or they all fail
         * @returns true if the object is truthful, has a mixins property and that mixin property contains a key of
         * the given type
         * @memberof Widget
         */
        Widget.prototype.is = function (self, obj) {
            var exists = _.has(self.mixins, obj);
            if (!exists) {
                for (var i in self.mixins) {
                    exists = _.isFunction(obj) ? self.mixins[i] == obj : self.mixins[i] instanceof obj;
                    if (exists) {
                        break;
                    }
                }
            }
            return exists;
        };

        /***
         * Check if the given type has had bkit/Widget mixed in
         * @param obj the object to check
         * @returns true if Widget was mixed into the object
         * @memberof Widget
         */
        Widget.prototype.isWidget = true;

        /**
         * Every Mixin gets a unique hash code. This hash code is the same for all instances of that Mixin
         * To get a hash per instance use the self.instanceId() method
         * @returns {int} The hash code for this widget
         * @memberof Widget
         */
        Widget.prototype.hash = function (self) {
            return self.hashCode;
        };

        /**
         * Every instance of a widget receives an ID separate to the widget's hash code
         * which is the same for all instances of the same widget
         * @returns {int} the ID for this instance
         * @memberof Widget
         */
        Widget.prototype.instanceId = function (self) {
            return self.instance_id;
        };

//        Widget.prototype.toString = function (self) {
//            return JSON.stringify(self);
//        };

        return Widget;
    });
