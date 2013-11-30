define('bkit/Promise',
    [
        'underscore'
    ],
    function (_) {
        /**
         * Provide a convenient way to apply a function on success or erroor
         * @param success true or false, if true the then function is applied otherwise else is applied
         * @param context the context which is used to execute the callbacks to then and else
         * @param args* 1 or more arguments to pass to the then/else callbacks
         * @constructor
         */
        function Promise(success, context, args) {
            this.success = !!success;//cast to boolean if not already
            this.args = _.toArray(arguments).slice(2);
            this.context = context;
        }

        /**
         * Executes the given callback if this promise was successful
         * @param callback  the callback to execute
         * @returns {Promise}  this promise
         */
        Promise.prototype.then = function (callback) {
            this.success && callback ?
                callback.apply(this.context, this.args) :
                false;
            return this;
        };

        Promise.prototype.isPromise = true;

        /**
         * Executes the given callback if this promise was NOT successful
         * @param callback  the callback to execute
         * @returns {Promise}  this promise
         */
        Promise.prototype.else = function (callback) {
            !this.success && callback ?
                callback.apply(this.context, this.args) :
                false;
            return this;
        };
        return Promise;
    });