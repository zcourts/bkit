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
    return   function (mixins, obj) {
        var definition = obj;
        definition.mixins = {};
        definition.isMixin = function () {
            return true;
        };
        function doMixin(mixin, mixinPath, _with, without, force) {
            definition.mixins[mixinPath] = mixin;
            //for each property in the mixin, mix it into the definition observing with,without and force rules
            _.each(mixin, function (value, name) {
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

                if (name) {
                    //if this property isn't already defined then add it
                    if (!definition[name]) {
                        definition[name] = value;
                        if (definition[name]) {
                            definition[name].defined_by = mixinPath;
                            //definition[name].definition = mixin;
                        }
                    } else {
                        //if the name is already defined it should be over written if and only if
                        //definition[name].defined_by is present AND force contains name
                        if (force.length > 0 && definition[name]['defined_by'] && _.indexOf(force, name) != -1) {
                            definition[name] = value;
                            if (definition[name]) {
                                definition[name].defined_by = mixinPath;
                                //definition[name].definition = mixin;
                            }
                        }
                    }
                }
            });
        }

        _.each(mixins, function (mixinDefinition) {
            var mixinPath = mixinDefinition, _with = [], without = [], force = [];
            console.log(mixinDefinition)
            if (_.isFunction(mixinDefinition)) {
                //passing true causes the proxy from the Creator module to return the underlying object definition
                mixinDefinition = mixinDefinition(true)
            }
            if (_.isObject(mixinDefinition)) {
                mixinPath = mixinDefinition['name'];
                if (!mixinPath) {
                    // throw new Error("A Mixin specified as an object must have a name property");
                    mixinPath = mixinDefinition.type ? mixinDefinition.type : 'unknown';
                    //do mix in, treating mixinDefinition as the object to be mixed in
                    doMixin(mixinDefinition, mixinPath, _with, without, force);
                    return;
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
                    //intentionally not doing anything here, if mixin path is defined allow the else block to move on below
                    //where a dynamic require is done treating mixin path  as a string path to the module to be mixed in
                }
            }
            //do a dynamic require if mixin definition is a string
            require([mixinPath], function (mixin) {
                doMixin(mixin, mixinPath, _with, without, force);
            });
        });
        //return the definition augmented with any mixin required
        return definition;
    }
});
