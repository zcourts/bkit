define('bkit/Attributable',
    [
        'module',
        'bkit/Mixin'
    ], function (module, Mixin) {
        /**
         * @mixin
         * @global
         */
        function Attributable() {
        }

        Attributable.prototype.type = module.id;
        Attributable.prototype.namespace = 'this';
        Attributable.prototype.defaults = {attr: {}};

        /**
         * Sets the given name value pair on the object
         * @param self
         * @param k the name/key
         * @param v the value to assign to the name/key
         * @memberof Attributable
         */
        Attributable.prototype.set = function (self, k, v) {
            self.options.attr[k] = v;
        };

        /**
         * Gets a previously set attribute
         * @param self
         * @param k the name/key of the attribute to get
         * @memberof Attributable
         * @returns {*} the value previously set or undefined if it doesn't exist
         */
        Attributable.prototype.get = function (self, k) {
            return self.options.attr[k];
        };

        return Mixin([], Attributable);
    });
