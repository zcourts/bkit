define('bkit/Mixin', ['require', 'underscore', 'jquery'], function (require, _, $) {
    return   function (mixins, MixinWidget) {

        MixinWidget.prototype.inits = MixinWidget.prototype.inits || [];
        MixinWidget.prototype.mixins = MixinWidget.prototype.mixins || {};

        if (MixinWidget.prototype.type) {
            MixinWidget.prototype.mixins[MixinWidget.prototype.type] = MixinWidget;
        }
        MixinWidget.prototype.isMixin = true;

        function Namespace() {
            console.log('namespace')
        }

        /**
         * Gets the function prototype to which a widget's functions should be added
         * @param fn the function whose namespace should be fetched
         * @param strName a valid namespace - a simple string such as 'touch' our 'user.touch'.
         * A dot separated namespace causes any non-existent parent to be created.
         * @returns {Object|Function|*}
         */
        function getNamespace(fn, strName) {
            var namespace = fn.prototype;
            _.each(strName.split('.'), function (value) {
                if (value && value != '') {
                    if (!namespace[value]) {
                        namespace[value] = Namespace.prototype;
                    }
                    namespace = namespace[value];
                }
            });
            return namespace;
        }

        function doMixin(mixin) {
            if (mixin.prototype.init) {
                MixinWidget.prototype.inits.push(mixin);
            }
            MixinWidget.prototype.mixins[mixin.prototype.type] = mixin;
            var proto = getNamespace(MixinWidget, mixin.prototype.namespace);
            _.each(mixin.prototype, function (value, name) {
                proto[name] = value;
                proto[name].defined_by = mixin.prototype.type;
            });
        }

        _.each(mixins, function (mixinDefinition) {
            if (_.isFunction(mixinDefinition)) {
                if (_.isString(mixinDefinition.prototype.namespace)) {
                    doMixin(mixinDefinition);
                } else {
                    throw new Error("All Mixins must have a namespace. On => " +
                        mixinDefinition.prototype.type + " definition => " + mixinDefinition);
                }
            } else {
                throw new Error("A mixin must either be a function of an object capable of specifying how to get the required function")
            }
        });
        //return the definition augmented with any mixin required
        return MixinWidget;
    }
});
