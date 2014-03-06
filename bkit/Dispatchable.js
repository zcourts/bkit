define('bkit/Dispatchable',
    [
        'module',
        'bkit/Mixin',
        'bkit/Promise',
        'bkit/SimpleEvent',
        'signals'
    ], function (module, Mixin, Promise, SimpleEvent, Signal) {
        /**
         * Represents any module which can create, have and dispatch events
         * @mixin
         * @global
         */
        function Dispatchable() {
        }

        Dispatchable.prototype.type = module.id;

        /**
         * The e namespace contains all events an object responds to and/or emits
         * @namespace event
         */
        Dispatchable.prototype.namespace = 'event';
        Dispatchable.prototype.defaults = {event: {}};

        Dispatchable.prototype.init = function (self) {
            self.e = self.e ? self.e : {};
        };

        /**
         * Creates a new event with the given name.
         * <br />
         * Note that the new event is created under the namespace 'e' so the newly created event is accessible as
         * obj.e.name
         * @param self {*} the instance of globally shared widget
         * @param name {string} the name of the event to create
         * @param enable_linger {Boolean} iff true then the newly created event 'memorizes' the parameters from the last time the
         * event was dispatched for a number of milliseconds, determined by linger_time. This means that if the event
         * is dispatched before a handler is added, the handler is still invoked IFF the handler is added before the
         * linger_time has passed since the last dispatch of the event.
         * @param linger_time {Number} how long, in milliseconds, an event should memorize its last parameters for
         * @returns {SimpleEvent} the event created
         * @memberof Dispatchable
         */
        Dispatchable.prototype.create = function (self, name, enable_linger, linger_time) {
            self.e[name] = new SimpleEvent({
                event: {
                    name: name,
                    enable_signal_lingering: enable_linger !== false,
                    signal_linger_time: linger_time ? linger_time : 30000
                }
            });
            return self.e[name];
        };

        /**
         * Checks if this {@link Dispatchable} object responds to a given event
         * @param self {*}
         * @param event {string} the name of the event to check for
         * @returns {boolean}
         * @memberof Dispatchable
         */
        Dispatchable.prototype.respondsTo = function (self, event) {
            return !!self.e[event];
        };

        /**
         * Checks if this {Dispatchable} object responds to a given event.
         * @param self
         * @param event the event to check for
         * @returns {Promise} a promise which executes it's then callback if the event is available or it's
         * otherwise callback if the event doesn't exist
         * @memberof Dispatchable
         */
        Dispatchable.prototype._ = function (self, event) {
            return new Promise(self.respondsTo(event), self, self.e[event]);
        };
        return Mixin([], Dispatchable);
    });
