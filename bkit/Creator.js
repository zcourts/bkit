define('bkit/Creator', [], function () {
    return function (obj) {
        var hashCode = function (instance) {
            //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
            var hash = 0, character, keys = Object.keys(instance), len = keys.length;
            if (len == 0) return hash;
            //using all keys
            for (var i = 0; i < len; i++) {
                //using all characters of the current key
                for (var j = 0; j < keys[i].length; j++) {
                    character = keys[i].charCodeAt(j);
                    hash = ((hash << 5) - hash) + character + instance._cloneId;
                    hash |= 0; // Convert to 32bit integer
                }
            }
            return hash;
        };
        var proxy = function (mixingIn) {
            if (mixingIn) {
                return obj;
            }
            var instance = JSON.parse(JSON.stringify(obj));
            instance._cloneId = new Date().getMilliseconds() + ('' + Math.random()).substring(2);
            instance._hashcode = hashCode(instance);
            proxy.prototype = instance.prototype;
            //if instance initializer is provided call it before emitting init
            console.log(instance)
            instance._('created').then(function () {
                instance.emit('created');
            });
            return instance;
        };
        return proxy;
    }
});