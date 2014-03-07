define('bkit/EventBinding',
    [
        'module',
        'bkit/Mixin',
        'underscore',
    ], function (module, Mixin, _) {
        /**
         * A binding is the result of subscribing to an event which allows you to later unsubscribe, even anonymous functions
         * @mixin
         * @global
         * @memberof event
         */
        function EventBinding() {
        }

        EventBinding.prototype.type = module.id;

        /**
         * @namespace event
         */
        EventBinding.prototype.namespace = 'event';

        EventBinding.prototype.defaults = {
            event: {binding: false}
        };

        EventBinding.prototype.init = function (self) {
            if (self.options.event.binding === false) {
                throw new Error('Must provide binding');
            }
        };

        /**
         * Check if this binding will only be executed once for the event it was subscribed to
         * @param self
         * @returns {Boolean}
         * @memberof EventBinding
         */
        EventBinding.prototype.isOnce = function (self) {
            return self.options.event.binding.isOnce();
        };

        /**
         * Unsubscribes this binding permanently for it to stop receiving events.
         * This binding is effectively inert after invoking this.
         * If you intend to re-activate this binding again, use {@link EventBinding#disable} and {@link EventBinding#enable}
         * @param self
         * @memberof EventBinding
         */
        EventBinding.prototype.unsubscribe = function (self) {
            self.options.event.binding.detach();
        };

        /**
         * Get the function that was used to subscribe and created this binding
         * @param self
         * @memberof EventBinding
         */
        EventBinding.prototype.get = function (self) {
            return self.options.event.binding.getListener();
        };

        /**
         * Trigger this event binding. Only the underlying callback will be executed, other bindings that subscribe
         * to the same event that produced this binding will not be triggered
         * @param self
         * @param {...*} args a list of arguments to be passed to the callback
         * @return the value returned by the callback
         * @memberof EventBinding
         */
        EventBinding.prototype.dispatch = function (self, args) {
            //passing arguments directly so that self is also included
            return self.options.event.binding.execute.apply(this, arguments)
        };

        /**
         * Enable this binding if it was previously disabled.
         * @param self
         * @memberof EventBinding
         */
        EventBinding.prototype.enable = function (self) {
            self.options.event.binding.active = true;
        };

        /**
         * Disable this binding so that no further events are dispatched to it until it is enabled again
         * @param self
         * @memberof EventBinding
         */
        EventBinding.prototype.disable = function (self) {
            self.options.event.binding.active = false;
        };

        return Mixin([], EventBinding);
    });
