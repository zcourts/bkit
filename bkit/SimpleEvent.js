define('bkit/SimpleEvent',
    [
        'module',
        'bkit/Mixin',
        'bkit/EventBinding',
        'underscore',
        'signals'
    ], function (module, Mixin, EventBinding, _, Signal) {
        /**
         * Container for an event that can be dispatched.
         * Effectively, wraps js-signal's "Signal" type.
         * It borrows ideas from the built in Event object for more info
         * {@see https://developer.mozilla.org/en/docs/Web/API/Event}
         * @mixin
         * @global
         */
        function SimpleEvent() {
        }

        SimpleEvent.prototype.type = module.id;

        /**
         * The e namespace contains all events an object responds to and/or emits
         * @namespace event
         */
        SimpleEvent.prototype.namespace = 'this';

        SimpleEvent.prototype.defaults = {
            event: {
                enable_signal_lingering: true,
                signal_linger_time: 30000,
                name: false
            }
        };

        SimpleEvent.prototype.init = function (self) {
            self.e = self.e ? self.e : {};
            if (!_.isString(self.options.event.name)) {
                throw new Error("An event must have a name");
            }
            self.e[self.options.event.name] = new Signal();
            //console.log(self.e, self.options.event.name);

            if (self.options.event.enable_signal_lingering) {
                self.e[self.options.event.name].memorize = true;
                setTimeout(function () {
                    self.e[self.options.event.name].forget();
                }, self.options.event.signal_linger_time)
            }
        };


        /**
         * Adds a function that will be notified ONCE AND ONLY ONCE when this event occurs.
         * i.e. after this event is triggered the first time, the given callback will not be notified again if the event occurs again after.
         * Use the {@link SimpleEvent#subscribe} method to add a listener for all occurrences of an event.
         * @param self
         * @param callback the function to add
         * @returns {EventBinding} a binding that allows you to control the subscription of the given function to this event
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.once = function (self, callback) {
            //adds callback, setting namespace as the context
            var binding = self.e[self.options.event.name].addOnce(callback, this);
            return new EventBinding({event: {binding: binding}});
        };

        /**
         * Adds a function that will be notified whenever this event occurs
         * @param self
         * @param callback the function to add
         * @returns {EventBinding} a binding that allows you to control the subscription of the given function to this event
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.subscribe = function (self, callback) {
            //adds callback, setting namespace as the context
            var binding = self.e[self.options.event.name].add(callback, this);
            return new EventBinding({event: {binding: binding}});
        };

        /**
         * Remove the given function if it was previously subscribed so that it is no longer notified when this event occurs
         * @param self
         * @param callback the function to remove
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.unsubscribe = function (self, callback) {
            self.e[self.options.event.name].remove(callback);
        };

        /**
         * Remove ALL functions previously subscribed so that they are no longer notified when this event occurs
         * @param self
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.unsubscribeAll = function (self) {
            self.e[self.options.event.name].removeAll();
        };

        /**
         * Triggers this event, notifying all it's subscribers passing each argument supplied
         * @param self
         * @param {...*} args
         * @returns {*}
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.dispatch = function (self, args) {
            return self.e[self.options.event.name].dispatch.apply(this, arguments);
        };

        /**
         * Check if the given function is already subscribed to this event
         * @param self
         * @param callback the function to check for
         * @returns {Boolean}
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.has = function (self, callback) {
            return self.e[self.options.event.name].has(callback);
        };

        /**
         * Enable this event if it was previously disabled with {@link SimpleEvent#disable}
         * @param self
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.enable = function (self) {
            self.e[self.options.event.name].active = true;
        };

        /**
         * Disable this event so that any attempt to {@link SimpleEvent#dispatch} it will not trigger any of the subscribers
         * @param self
         * @memberof SimpleEvent
         */
        SimpleEvent.prototype.disable = function (self) {
            self.e[self.options.event.name].active = false;
        };

        return Mixin([], SimpleEvent);
    });
