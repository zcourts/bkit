define('bkit/dowi/Widget',
    [
        'require',
        'jquery',
        'signals',
        'underscore',
        'module'                                   ,
        'bkit/Promise',
        'bkit/Util'
    ],
    function (require, $, Signal, _, module, Promise, Util) {
        function Widget() {
        }

        Widget.prototype.type = module.id;
        Widget.prototype.namespace = 'bkit';
        Widget.prototype.defaults = {signal_linger_time: 30000};

        Widget.prototype.init = function (self) {
            self.template = null;
            self.domNode = null;
            self.s = {};

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
         * @param obj the object to check
         * @param type the type to check for, typical of the form namespace/package/ModuleName e.g. bkit/dowi/Button
         * @returns true if the object is truthful, has a mixins property and that mixin property contains a key of
         * the given type
         */
        Widget.prototype.is = function (self, obj, type) {
            if (obj && type) {
                return obj && obj.mixins && obj.mixins[type]
            } else {
                return _.isFunction(obj) && self.mixins ? _.has(self.mixins, obj.type) :
                    _.isString(obj) && self.mixins ? _.has(self.mixins, obj) : false;
            }
        };

        /***
         * Check if the given type has had bkit/dowi/Widget mixed in
         * @param obj the object to check
         * @returns true if Widget was mixed into the object
         */
        Widget.prototype.isWidget = true;

        /**
         * Create a signal with the given name on this widget and add it to the list of the widget's signals
         * @param name the name of the signal to create
         * @returns the signal created
         */
        Widget.prototype.$ = function (self, name) {
            if (!name) {
                throw new Error('Cannot create a signal without a name')
            }
            self.s[name] = new Signal();
            //remember values after they are emitted so they can be replayed by any handler added after the emission
            self.s[name].memorize = true;
            return self.s[name];
        };

        Widget.prototype.createSignal = function (self, name) {
            return self.$(name);
        };

        Widget.prototype.getSignal = function (self, signal) {
            return self.s[signal];
        };
        /**
         * Provide a promise style response with a then and an else method.
         * If the given signal exists the then method is executed, if not the else method is executed
         * @param signal the signal to check for. This can be a string which is the name of the signal or
         * an object which will be treated as the signal to connect the slot to
         *
         *@return {Promise}  with then and else methods. then is executed if the signal exists otherwise else is executed.
         * The methods "then" and "else" available on the return object both invoke their callback with
         * the widget's "self. as the context;
         */
        Widget.prototype._ = function (self, signal) {
            var res = signal;
            if (_.isString(signal)) {
                res = self.getSignal(signal);
            }
            return new Promise(res, self.res);
        };

        Widget.prototype.respondsTo = function (self, signal) {
            return self._(signal);
        };

        /**
         * Connect a signal to a slot, enabling that slot to be notified when the signal is emitted
         * @param signal the signal to connect to the slot. This can be a string which is the name of the signal or
         * an object which will be treated as the signal to connect the slot to
         * @param slot the slot to which the signal should be connected
         * @param once if truthful then the signal is only notified of the event once
         * @param priority determines the order in which the slot is notified of the event against other slots
         * @param context the context in which the slot is executed, i.e. what does "this" represent in the slot
         * the context must be a widget or something it is mixed into
         * @returns the binding created from the signal being connected to the given slot
         */
        Widget.prototype.connect = function (self, signal, slot, once, priority, context) {
            //context should always be this or something it's mixed into
            context = context ? context : self;
            var binding;
            self._(signal)
                .then(function (signal) {
                    if (once) {
                        binding = signal.addOnce(slot, context, priority);
                    } else {
                        binding = signal.add(slot, context, priority);
                    }
                })
                .else(function () {
                    throw new Error(signal + " does not exist, cannot connect a slot to a non-existent signal.")
                });
            return binding;
        };
        /**
         * Emit a signal on this widget.
         * @throws Error if the signal doesn't exist on this widget
         * @param signal The name of the signal to emit
         * @param params* one or more parameters to be passed as the signal's arguments
         */
        Widget.prototype.emit = function (self, signal, params) {
            params = _.toArray(arguments).slice(1);
            self._(signal)
                .then(function (s) {
                    s.dispatch.apply(self, params);
                    setTimeout(function () {
                        s.forget();
                    }, self.signal_linger_time)
                })
                .else(function () {
                    throw new Error("Attempting to emit an unknown signal " + signal);
                });
        };

        /**
         * Every Mixin gets a unique hash code. This hash code is the same for all instances of that Mixin
         * To get a hash per instance use the self.instanceId() method
         * @returns {int} The hash code for this widget
         */
        Widget.prototype.hash = function (self) {
            return self.hashCode;
        };

        /**
         * Every instance of a widget receives an ID separate to the widget's hash code
         * which is the same for all instances of the same widget
         * @returns {int} the ID for this instance
         */
        Widget.prototype.instanceId = function (self) {
            return self.instance_id;
        };

        Widget.prototype.toString = function (self) {
            return JSON.stringify(self);
        };

        return Widget;
    });
