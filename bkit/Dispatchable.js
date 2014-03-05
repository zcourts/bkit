define('bkit/Dispatchable',
    [
        'module',
        'bkit/Mixin',
        'bkit/Promise',
        'signals'
    ], function (module, Mixin, Promise, Signal) {
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

        Dispatchable.prototype.init = function (self) {
            self.e = self.e ? self.e : {};
        };

        /**
         * Creates a new signal with the given name.
         * <br />
         * Note that the new signal is created under the namespace 'e' so the newly created signal is accessible as
         * obj.e.name
         * @param self {*} the instance of globally shared widget
         * @param name {string} the name of the signal to create
         * @returns {Signal} the signal created
         * @memberof Dispatchable
         */
        Dispatchable.prototype.create = function (self, name) {
            self.e[name] = new Signal();
            return self.e[name];
        };

        /**
         * Checks if this {@link Dispatchable} object responds to a given event/signal
         * @param self {*}
         * @param signal {string} the name of the signal to check for
         * @returns {boolean}
         * @memberof Dispatchable
         */
        Dispatchable.prototype.respondsTo = function (self, signal) {
            return !!self.e[signal];
        };

        /**
         * Checks if this {Dispatchable} object responds to a given signal.
         * @param self
         * @param signal the signal to check for
         * @returns {Promise} a promise which executes it's then callback if the signal is available or it's
         * otherwise callback if the signal doesn't exist
         * @memberof Dispatchable
         */
        Dispatchable.prototype._ = function (self, signal) {
            return new Promise(self.respondsTo(signal), self, self.e[signal]);
        };
        return Mixin([], Dispatchable);
    });
