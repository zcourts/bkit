define('bkit/Containable',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/Attributable',
        'bkit/Widget'
    ],
    function (module, _, Mixin, Attributable, Widget) {
        /**
         * Any mixin which can contain child elements
         * @mixin
         * @mixes Widget
         * @mixes Attributable
         * @global
         */
        function Containable() {
        }

        Containable.prototype.type = module.id;
        Containable.prototype.namespace = 'this';

        Containable.prototype.init = function (self) {
            self.container = {
                //set of child instances
                children: {},
                //set of types that can be added as a child
                accepts: {}
            };
        };

        /**
         * Adds a child to this container.
         * The child will then be managed by this container
         * @param {Widget} child the child to be added
         * @param self
         * @memberof Containable
         */
        Containable.prototype.addChild = function (self, child) {
            if (self.accepts(child)) {
                self.container.children[child.instanceId()] = child;
                return true;
            }
            return false;
        };

        /**
         * Checks if this container is allowed to accept a given type.
         * The type must be a {@link Widget}
         * @param self
         * @param type if this is a string, it is treated as the path to a module e.g. bkit/Page, if it is a function
         * it is treated as a constructor of a module, anything else is checked with instanceof against all allowed types.
         * @returns {boolean} true if type is one of the accepted types that can be passed to {@link #addChild}
         * @memberof Containable
         */
        Containable.prototype.accepts = function (self, type) {
            if (!type) {
                return false;
            }
            if (Object.keys(self.container.accepts).length === 0) {
                return true; //if no key is available then all types are accepted
            }
            return !!(_.find(self.container.accepts, function (child) {
                return type == child || type == child.prototype.type || type == child.type ||
                    (type.prototype && child.prototype ? type.prototype.type == child.prototype.type : false) ||
                    type.type == child.type || type.type == child ||
                    (type.prototype ? type.prototype.type == child : false) ||
                    (child.prototype ? child.prototype.type == type : false) ||
                    type instanceof child;
            }));
        };

        /**
         * Adds a type that is allowed to be accepted by {@link #addChild}
         * @param obj {String|Function|Array} the string path for a module or the module's constructor or instance thereof
         * If this is an array, each item in the array is added as an acceptable type and the return type is always true.
         * @returns {boolean} true if the obj was accepted
         * @memberof Containable
         * @param self
         */
        Containable.prototype.addAcceptableType = function (self, obj) {
            if (_.isArray(obj)) {
                _.each(obj, function (a) {
                    self.addAcceptableType(a);
                });
                return true;
            }
            if (obj) {
                var added = _.isString(obj) ? self.container.accepts[obj] = obj : //string added directly
                    _.isFunction(obj) ? self.container.accepts[obj.prototype.type] = obj : //function type take from prototype
                        obj.isWidget ? self.container.accepts[obj.type] = obj : false; //object has type attr
                //added === false only in last case where obj.isWidget is falsy
                return added !== false;
            }
            return false;
        };

        return Mixin([Widget, Attributable], Containable);
    });
