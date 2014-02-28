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
            var $this = this;
            this.template = null;
            this.domNode = null;
            this.s = {};
            this.signal_linger_time = 30000;

            //generate the hash code for this widget
            var allMixinNames = "";
            _.each(this.mixins, function (val, key) {
                allMixinNames += key;
            });

            this.hashCode = Util.hash(allMixinNames);
            //and the instance id
            this.instance_id = Util.hash(new Date().getTime() + "" + Math.random());
            //NOTE: Widget's constructor is likely the first to be called so this event will be emitted before others
            //have a chance to subscribe to it, but events are kept around for up to signal_linger_time after which
            //they're removed. this means even though this is triggered before any subscriptions within that time
            //will receive the event
            this.emit('created');
        }

        Widget.prototype.type = module.id;

        /**
         * Check if the given object is of the specified type.
         * An object is of a type if that type was mixed into the object
         * @param obj the object to check
         * @param type the type to check for, typical of the form namespace/package/ModuleName e.g. bkit/dowi/Button
         * @returns true if the object is truthful, has a mixins property and that mixin property contains a key of
         * the given type
         */
        Widget.prototype.is = function (obj, type) {
            if (obj && type) {
                return obj && obj.mixins && obj.mixins[type]
            } else {
                return _.isFunction(obj) && this.mixins ? _.has(this.mixins, obj.type) :
                    _.isString(obj) && this.mixins ? _.has(this.mixins, obj) : false;
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
        Widget.prototype.$ = function (name) {
            if (!name) {
                throw new Error('Cannot create a signal without a name')
            }
            this.s[name] = new Signal();
            //remember values after they are emitted so they can be replayed by any handler added after the emission
            this.s[name].memorize = true;
            return this.s[name];
        };

        Widget.prototype.createSignal = function (name) {
            return this.$(name);
        };

        Widget.prototype.getSignal = function (signal) {
            return this.s[signal];
        };
        /**
         * Provide a promise style response with a then and an else method.
         * If the given signal exists the then method is executed, if not the else method is executed
         * @param signal the signal to check for. This can be a string which is the name of the signal or
         * an object which will be treated as the signal to connect the slot to
         *
         *@return {Promise}  with then and else methods. then is executed if the signal exists otherwise else is executed.
         * The methods "then" and "else" available on the return object both invoke their callback with
         * the widget's "this" as the context;
         */
        Widget.prototype._ = function (signal) {
            var res = signal;
            if (_.isString(signal)) {
                res = this.getSignal(signal);
            }
            return new Promise(res, this, res);
        };

        Widget.prototype.respondsTo = function (signal) {
            return this._(signal);
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
        Widget.prototype.connect = function (signal, slot, once, priority, context) {
            //context should always be this or something it's mixed into
            context = context ? context : this;
            var binding;
            this._(signal)
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
        Widget.prototype.emit = function (signal, params) {
            var $widget = this;
            params = _.toArray(arguments).slice(1);
            this._(signal)
                .then(function (s) {
                    s.dispatch.apply(this, params);
                    setTimeout(function () {
                        s.forget();
                    }, $widget.signal_linger_time)
                })
                .else(function () {
                    throw new Error("Attempting to emit an unknown signal " + signal);
                });
        };

        /**
         * Every Mixin gets a unique hash code. This hash code is the same for all instances of that Mixin
         * To get a hash per instance use the this.instanceId() method
         * @returns {int} The hash code for this widget
         */
        Widget.prototype.hash = function () {
            return this.hashCode;
        };

        /**
         * Every instance of a widget receives an ID separate to the widget's hash code
         * which is the same for all instances of the same widget
         * @returns {int} the ID for this instance
         */
        Widget.prototype.instanceId = function () {
            return this.instance_id;
        };

        Widget.prototype.toString = function () {
            return JSON.stringify(this);
        };

        return Widget;
    });
