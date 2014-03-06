define('bkit/SimpleEvent',
    [
        'module',
        'bkit/Mixin',
        'underscore',
        'signals'
    ], function (module, Mixin, _, Signal) {
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
        SimpleEvent.prototype.namespace = 'event';
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
            self.e[self.options.event.name].signal = new Signal();

            if (self.options.event.enable_signal_lingering) {
                self.e[self.options.event.name].memorize = true;
                setTimeout(function () {
                    self.e[self.options.event.name].signal.forget();
                }, self.options.event.signal_linger_time)
            }
        };


        SimpleEvent.prototype.once = function (self, callback) {
        };

        SimpleEvent.prototype.subscribe = function (self, callback) {
        };

        SimpleEvent.prototype.unsubscribe = function (self, callback) {
        };

        SimpleEvent.prototype.dispatch = function (self, callback) {
        };

        SimpleEvent.prototype.has = function (self, callback) {
        };

        SimpleEvent.prototype.enable = function (self, callback) {
        };

        SimpleEvent.prototype.disable = function (self, callback) {
        };
        return Mixin([], SimpleEvent);
    });
