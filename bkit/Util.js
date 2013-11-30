define('bkit/Util',
    [
        'underscore'
    ],
    function () {
        function Util() {
        }

        /**
         * Hash a string to a 32 bit integer
         * @param chars the string/chars to hash
         */
        Util.prototype.hash = function (chars) {
            //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
            var hash = 0;
            _.each(chars, function (character, idx) {
                hash = ((hash << 5) - hash) + chars.charCodeAt(idx);
                hash |= 0; // Convert to 32bit integer
            });
            return hash;
        };
        return new Util();
    });