define('bkit/dowi/Widget', ['require', 'jquery', 'signals', 'underscore', 'module', 'bkit/Creator'],
    function (require, $, Signal, _, module, Creator) {
        var type = module.id;
        var Widget = {
            type: type,
            template: null,
            domNode: null,
            s: {},
            signal_linger_time: 30000,
            /**
             * Check if the given object is of the specified type.
             * An object is of a type if that type was mixed into the object
             * @param obj the object to check
             * @param type the type to check for, typical of the form namespace/package/ModuleName e.g. bkit/dowi/Button
             * @returns true if the object is truthful, has a mixins property and that mixin property contains a key of
             * the given type
             */
            is: function (obj, type) {
                return obj && obj.mixins && obj.mixins[type]
            },
            /***
             * Check if the given type has had bkit/dowi/Widget mixed in
             * @param obj the object to check
             * @returns true if Widget was mixed into the object
             */
            isWidget: function (obj) {
                return this.is(obj, type)
            },
            /**
             * Create a signal with the given name on this widget and add it to the list of the widget's signals
             * @param name the name of the signal to create
             * @returns the signal created
             */
            $: function (name) {
                if (!name) {
                    throw new Error('Cannot create a signal without a name')
                }
                this.s[name] = new Signal();
                //remember values after they are emitted so they can be replayed by any handler added after the emission
                this.s[name].memorize = true;
                return this.s[name];
            },
            createSignal: function (name) {
                return this.$(name);
            },
            getSignal: function (signal) {
                return this.s[signal];
            },
            _: function (signal) {
                var res = this.getSignal(signal),
                    promise = {
                        then: function (callback) {
                            res && callback ? callback.call(this, res) : false;
                            return promise;
                        },
                        else: function (callback) {
                            !res && callback ? callback.call(this, false) : false;
                            return promise;
                        }
                    };
            },
            respondsTo: function (signal) {
                return this._(signal);
            },

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
            connect: function (signal, slot, once, priority, context) {
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
            },
            /**
             * Emit a signal on this widget.
             * @throws Error if the signal doesn't exist on this widget
             * @param signal The name of the signal to emit
             * @param params* one or more parameters to be passed as the signal's arguments
             */
            emit: function (signal, params) {
                params = _.toArray(arguments).slice(1);
                if (!this.s[signal]) {
                    throw new Error("Attempting to emit an unknown signal " + signal);
                }
                this.s[signal].dispatch.apply(this, params);
                var $widget = this;
                setTimeout(function () {
                    $widget.signals[signal].forget();
                }, this.signal_linger_time)
            }
        };

        function Initializer(instance) {
            //setup signals that all widgets should be able to handle
            instance.$('created');
            instance.$('destroyed');
            instance.$('prepended');
            instance.$('rendered');
            instance.$('appended');
            instance.$('setTemplate');
            instance.$('leftClicked');
            instance.$('middleClicked');
            instance.$('rightClicked');
            instance.$('doubleClicked');
            instance.$('mouseEntered');
            instance.$('mouseLeft');
            instance.$('mouseMoved');
            instance.$('keyDown');
            instance.$('keyUp');
            var addDomListeners = function () {
                $(instance.domNode).mousedown(function (e) {
                    switch (e.which) {
                        case 1:
                            instance.emit('leftClicked', e);
                            break;
                        case 2:
                            instance.emit('middleClicked', e);
                            break;
                        case 3:
                            instance.emit('rightClicked', e);
                            break;
                        default:
                            console.log('Unknown pointing device...');
                    }
                });
                $(instance.domNode).on('dblclick', function (e) {
                    instance.emit('doubleClicked', e)
                });
                $(instance.domNode).on('mouseenter', function (e) {
                    instance.emit('mouseEntered', e)
                });
                $(instance.domNode).on('mouseleave', function (e) {
                    instance.emit('mouseLeft', e)
                });
                $(instance.domNode).on('mousemove', function (e) {
                    instance.emit('mouseMoved', e)
                });
                $(instance.domNode).on('keyup', function (e) {
                    instance.emit('keyUp', e)
                });
                $(instance.domNode).on('keydown', function (e) {
                    instance.emit('keyDown', e)
                });

            };
            //listen for events of interest
            var append = function (parent) {
                $(parent.domNode).append(instance.domNode)
            };
            instance.connect('setTemplate', function (template) {
                instance.template = template;
                instance.domNode = $.parseHTML(template);
                addDomListeners();
            });
            instance.connect('rendered', append);
            instance.connect('appended', append);
            instance.connect('prepended', function (parent) {
                $(parent.domNode).prepend(instance.domNode);
            });

            instance.connect('created', function () {
                //todo
            });
            instance.connect('destroyed', function () {
                $(instance.domNode).hide(500, function () {
                    $(instance.domNode).remove()
                })
            })
        }

        return Creator(Widget);
    });
