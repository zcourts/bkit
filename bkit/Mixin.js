/**
 * This module is central to BKit. It is responsible for mixing any number of modules together to create new ones.
 * @param mixins {Array} A list of modules that are to be mixed in
 * @param MixinWidget {*} The module which all the mixins will be mixed into
 * @return {MixinContainer} A function which represents the results of performing a mix in.
 * This function should be invoked inline i.e. MixinContainer() although new MixinContainer() will work it requires
 * additional computation for the instance to become the expected type.
 * @module
 */
define('bkit/Mixin', [ 'underscore', 'jquery', 'bkit/Namespace'], function (_, $, Namespace) {
    return   function (mixins, MixinWidget) {
        //MixinWidget is just another widget to be mixed in and is treated no differently in that sense
        mixins.push(MixinWidget);

        /**
         * Given an instance, get or create the namespace given by strName
         * @param instance the instance on which the namespace is required to exist
         * @param strName the namespace to get, this can be a simple value such as 'bkit' or a dot separated
         * string such as 'user.event.touch', unless each parent namespace exists it will be created
         * IFF strName == 'this' then instance is returned directly so that attributes are added to the instance without
         * a namespace.
         * @returns {Namespace} a namespace to which properties/functions should be added in the example above the
         * 'touch' namespace is returned
         */
        function getNamespace(instance, strName) {
            if (strName == 'this') {
                return instance;
            }
            var namespace = instance;
            _.each(strName.split('.'), function (value) {
                if (value && value !== '') {
                    if (!namespace[value]) {
                        namespace[value] = new Namespace();
                    }
                    namespace = namespace[value];
                }
            });
            return namespace;
        }

        /**
         * Partially apply a function setting the first parameter to instance and "this" inside fn to refer to the namespace
         * @param namespace the namespace "this" should refer to
         * @param instance the instance to set as the first parameter
         * @param fn the function the "partial application" is applied to
         * @returns {Function}
         */
        function partial(namespace, instance, fn) {
            //namespace[name] = _.partial.call(namespace, value, instance); doesn't set 'this' to namespace, revisit
            return  function PartiallyAppliedFunction() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(instance);
                return fn.apply(namespace, args);
            };
        }

        /**
         * Given a function, take each property available on it's prototype and mix them into the instance provided
         * under the namespace defined by mixin.prototype.instance
         * @param mixin the function whose prototype will be mixed in under its defined namespace
         * @param instance the instance under which functions will be re-defined
         */
        function doMixin(mixin, instance) {
            var namespace = getNamespace(instance, mixin.prototype.namespace);
            if (mixin.prototype.init) {
                instance.inits.push(partial(namespace, instance, mixin.prototype.init));
            }
            instance.mixins[mixin.prototype.type] = mixin;

            _.each(mixin.prototype, function (value, name) {
                if (_.isFunction(value)) {
                    namespace[name] = partial(namespace, instance, value);
                } else {
                    namespace[name] = value;
                }
            });
        }

        /**
         * A function representing the results of performing a mixin
         * @param userOpts an object representing the configuration to be passed to the mixin
         * @returns {MixinWidget} the original widget that had other widget's mixed in. This allows type to be maintained
         * so that instanceof and so on work as expected.
         * @constructor
         * @global
         */
        function MixinContainer(userOpts) {
            var instance = new MixinWidget(),
            //true as the first argument causes a deep extend so we don't loose properties
            //second arg is an empty default object
                opts = [true, {}];
            instance.inits = [];
            instance.mixins = {};

            if (MixinWidget.prototype.type) {
                instance.mixins[MixinWidget.prototype.type] = MixinWidget;
            }
            instance.isMixin = true;

            //apply each mixin
            _.each(mixins, function (Mixin) {
                if (_.isFunction(Mixin)) {
                    if (_.isString(Mixin.prototype.namespace)) {
                        doMixin(Mixin, instance);
                        if (_.isObject(Mixin.prototype.defaults)) {
                            opts.push(Mixin.prototype.defaults);
                        }
                    } else {
                        throw new Error("All Mixins must have a namespace. On => " +
                            Mixin.prototype.type + " definition => " + Mixin);
                    }
                } else {
                    throw new Error("A mixin must be a function");
                }
            });

            //add user options last so that it takes precedents over defaults
            opts.push(userOpts);
            opts = $.extend.apply($, opts);
            instance.options = opts;

            _.each(instance.inits, function (fn) {
                fn();
            });
            //always return instance regardless of how the function was invoked
            return instance;
        }

        //because the prototype of the function returned is mixed in
        //but we need the MixinContainer to provide a custom constructor
        //designed to avoid every object having MixinContainer as their constructor rather than the real type
        MixinContainer.prototype = MixinWidget.prototype;
        return MixinContainer;
    };
});
