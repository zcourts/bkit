define('bkit/dowi/Widget', ['require', 'jquery', 'signals', 'underscore', 'module'],
    function (require, $, Signal, _, module) {
        var type = module.id;

        function Widget() {
            var $this = this;
            $this.type = type;
            $this.template = null;
            $this.domNode = null;
            $this.s = {};
            $this.signal_linger_time = 30000;
            //setup signals that all widgets should be able to handle
            $this.$('created');
            $this.$('destroyed');
            $this.$('prepended');
            $this.$('rendered');
            $this.$('appended');
            $this.$('setTemplate');
            $this.$('leftClicked');
            $this.$('middleClicked');
            $this.$('rightClicked');
            $this.$('doubleClicked');
            $this.$('mouseEntered');
            $this.$('mouseLeft');
            $this.$('mouseMoved');
            $this.$('keyDown');
            $this.$('keyUp');
            var addDomListeners = function () {
                $($this.domNode).mousedown(function (e) {
                    switch (e.which) {
                        case 1:
                            $this.emit('leftClicked', e);
                            break;
                        case 2:
                            $this.emit('middleClicked', e);
                            break;
                        case 3:
                            $this.emit('rightClicked', e);
                            break;
                        default:
                            console.log('Unknown pointing device...');
                    }
                });
                $($this.domNode).on('dblclick', function (e) {
                    $this.emit('doubleClicked', e)
                });
                $($this.domNode).on('mouseenter', function (e) {
                    $this.emit('mouseEntered', e)
                });
                $($this.domNode).on('mouseleave', function (e) {
                    $this.emit('mouseLeft', e)
                });
                $($this.domNode).on('mousemove', function (e) {
                    $this.emit('mouseMoved', e)
                });
                $($this.domNode).on('keyup', function (e) {
                    $this.emit('keyUp', e)
                });
                $($this.domNode).on('keydown', function (e) {
                    $this.emit('keyDown', e)
                });

            };
            //listen for events of interest
            var append = function (parent) {
                $(parent.domNode).append($this.domNode)
            };
            $this.connect('setTemplate', function (template) {
                $this.template = template;
                $this.domNode = $.parseHTML(template);
                addDomListeners();
            });
            $this.connect('rendered', append);
            $this.connect('appended', append);
            $this.connect('prepended', function (parent) {
                $(parent.domNode).prepend($this.domNode);
            });

            $this.connect('created', function () {
                //todo
            });
            $this.connect('destroyed', function () {
                $($this.domNode).hide(500, function () {
                    $($this.domNode).remove()
                })
            })
        }

        /**
         * A set of constructors in the order their modules were mixed in.
         * @type {Array}
         */
        Widget.prototype.constructors = [];

        /**
         * Check if the given object is of the specified type.
         * An object is of a type if that type was mixed into the object
         * @param obj the object to check
         * @param type the type to check for, typical of the form namespace/package/ModuleName e.g. bkit/dowi/Button
         * @returns true if the object is truthful, has a mixins property and that mixin property contains a key of
         * the given type
         */
        Widget.prototype.is = function (obj, type) {
            return obj && obj.mixins && obj.mixins[type]
        };

        /***
         * Check if the given type has had bkit/dowi/Widget mixed in
         * @param obj the object to check
         * @returns true if Widget was mixed into the object
         */
        Widget.prototype.isWidget = function (obj) {
            return this.is(obj, type)
        };

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
         * @param signal the signal to check for
         */
        Widget.prototype._ = function (signal) {
            var res = this.getSignal(signal);
            return {
                then: function (callback) {
                    res && callback ? callback.call(this, res) : false;
                },
                else: function (callback) {
                    !res && callback ? callback.call(this, false) : false;
                }
            };
        };

        Widget.prototype.respondsTo = function (signal) {
            return this._(signal);
        };

        /**
         * Connect a signal to a slot, enabling that slot to be notified when the signal is emitted
         * @param signal the signal to connect to the slot
         * @param slot the slot to which the signal should be connected
         * @param once if truthful then the signal is only notified of the event once
         * @param priority determines the order in which the slot is notified of the event against other slots
         * @param context the context in which the slot is executed, i.e. what does "this" represent in the slot
         * the context must be a widget or something it is mixed into
         * @returns the binding created from the signal being connected to the given slot
         */
        Widget.prototype.connect = function (signal, slot, once, priority, context) {
            if (!this._(signal)) {
                throw new Error(signal + " does not exist, cannot connect a slot to a non-existent signal.")
            }
            var binding;
            //context should always be this or something it's mixed into
            context = context ? context : this;
            if (once) {
                binding = this.s[signal].addOnce(slot, context, priority);
            } else {
                binding = this.s[signal].add(slot, context, priority);
            }
            return binding;
        };
        /**
         * Emit a signal on this widget.
         * @throws Error if the signal doesn't exist on this widget
         * @param signal The name of the signal to emit
         * @param params* one or more parameters to be passed as the signal's arguments
         */
        Widget.prototype.emit = function (signal, params) {
            params = _.toArray(arguments).slice(1);
            if (!this.s[signal]) {
                throw new Error("Attempting to emit an unknown signal " + signal);
            }
            this.s[signal].dispatch.apply(this, params);
            var $widget = this;
            setTimeout(function () {
                $widget.signals[signal].forget();
            }, this.signal_linger_time)
        };

        return Widget;
    });
