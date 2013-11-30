define('bkit/Mixin', ['require', 'underscore'], function (require, _) {
    /**
     * Define a Mixin using the AMD API with an extra argument before the callback function.
     * For every Mixin created
     * @param name The name of the component being defined.
     * @param deps An array of dependencies
     * @param mixins  This extra argument is an array of strings and objects.
     *
     * If an item in this array is a string then that string represents the path to a mixin that is to be mixed into fn.
     * If an item in this array is an object then that object should be of the form
     * {
     *     name:"path/to/Mixin",
     *     with:['a','b','c','d'],
     *     without: ['e','f'],
     *     force:['b']
     * }
     *
     * The name property is required, all other properties are not.
     *
     * The 'with' property defines a list of properties that should be mixed in, if 'with' is missing or empty then all
     * properties from the named mixin will be mixed into the definition.
     *
     * The 'without' property defines a list of properties that should not be mixed into the definition. If 'without' is
     * missing or empty then no property is excluded unless there is a collision that isn't resolved in favor of the mixin
     *
     * The 'force' property defines a list of properties which, if any in the list are already defined while performing the
     * mixin then the properties specified are replaced with those given in the force array. If force is missing or empty
     * then either an exception is thrown or the property is not overwritten
     *
     * @param obj
     */
    return   function (mixins, def) {
        function Mixin() {
            for (var i = Mixin.prototype.constructors.length - 1; i >= 0; i--) {
                //apply with the proxy's context means each "super" constructor modifies the instance if they use this.
                Mixin.prototype.constructors[i].apply(this, arguments)
            }
            def.apply(this, arguments);
        }

        Mixin.prototype.constructors = def.prototype.constructors ? def.prototype.constructors : [];
        Mixin.prototype.mixins = {};

        if (def.prototype.type) {
            Mixin.prototype.mixins[def.prototype.type] = def;
        }

        Mixin.prototype.isMixin = true;

        function trace(name, value, path) {
            if (window.bkit_trace) {
                Mixin.prototype[name] = function () {
                    console.log('TRACE:', name, arguments,
                        _.isFunction(path) ? '' : path,
                        console.trace ? console.trace() : '');
                    if (value) {
                        return value.apply(this, arguments);
                    }
                    return undefined;
                }
            } else {
                Mixin.prototype[name] = value;
            }
        }

        //copy all properties from the definitions prototype to the proxy's
        _.each(def.prototype, function (value, name) {
            trace(name, value, def.prototype.type);
        });

        function doMixin(mixin, mixinPath, _with, without, force) {
            mixinPath = mixin.prototype.type ? mixin.prototype.type : _.isString(mixinPath) ? mixinPath : 'unknown';
            Mixin.prototype.constructors.push(mixin);
            Mixin.prototype.mixins[mixinPath] = mixin;
            _.each(mixin.prototype, function (value, name) {
                //if with is specified then only names in the _with array are allowed to be mixed in
                //so if name isn't found then return without doing anything
                if (_with.length > 0 && _.indexOf(_with, name) == -1) {
                    return;
                }
                //if without is specified then any name in the without array must not be mixed in
                //so if name is found in the without array then return without doing anything
                if (without.length > 0 && _.indexOf(without, name) != -1) {
                    return;
                }

                //if this property isn't already defined then add it
                if (!Mixin.prototype[name]) {
                    //Mixin.prototype[name] = value;
                    trace(name, value, mixinPath);
                    if (Mixin[name]) {
                        Mixin[name].defined_by = mixinPath;
                        //definition[name].definition = mixin;
                    }
                } else {
                    //if the name is already defined it should be over written if and only if
                    //definition[name].defined_by is present AND force contains name
                    if (force.length > 0
                        //&& definition.prototype[name].defined_by //only override properties defined through mixins?
                        && _.indexOf(force, name) != -1) {
                        //Mixin.prototype[name] = value;
                        trace(name, value, mixinPath);
                        if (Mixin.prototype[name]) {
                            Mixin.prototype[name].defined_by = mixinPath;
                            //definition[name].definition = mixin;
                        }
                    }
                }
            });
        }

        _.each(mixins, function (mixinDefinition) {
            var mixinPath = mixinDefinition, _with = [], without = [], force = [];
            if (_.isFunction(mixinDefinition)) {
                doMixin(mixinDefinition, mixinPath, _with, without, force);
            } else if (_.isObject(mixinDefinition)) {
                mixinPath = mixinDefinition['name'];
                if (!mixinPath) {
                    throw new Error("A Mixin specified as an object must have a name property");
                } else {
                    if (mixinDefinition['with']) {
                        _with = mixinDefinition['with'];
                    }
                    if (mixinDefinition['without']) {
                        without = mixinDefinition['without'];
                    }
                    if (mixinDefinition['force']) {
                        force = mixinDefinition['force'];
                    }
                    //do a dynamic require if mixin definition is a string
                    require([mixinPath], function (mixin) {
                        doMixin(mixin, mixinPath, _with, without, force);
                    });
                }
            } else {
                throw new Error("A mixin must either be a function of an object capable of specifying how to get the required function")
            }
        });
        //return the definition augmented with any mixin required
        return Mixin;
    }
});
