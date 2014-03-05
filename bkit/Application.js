define('bkit/Application',
    [
        'module', 'hasher', 'crossroads', 'underscore', 'bkit/Mixin', 'bkit/Attributable', 'bkit/Widget',
        'bkit/Dispatchable', 'bkit/Containable', 'bkit/Page', 'bkit/Promise', 'bkit/Util'
    ], function (module, hasher, crossroads, _, Mixin, Attributable, Widget, Dispatchable, Containable, Page, Promise, Util) {
        /**
         * @mixes Widget
         * @mixes Attributable
         * @mixes Dispatchable
         * @mixes Containable
         * @constructor
         * @global
         */
        function Application() {
        }

        Application.prototype.namespace = 'this';
        Application.prototype.type = module.id;
        Application.prototype.defaults = {
            url: {
                prefix: '/' //could be ! to support Google crawlable ajax sites
            }
        };

        Application.prototype.init = function (self) {
            var router = crossroads.create();

            self.set('router', router);
            self.set('url', hasher);

            self.e.create('pageRegistered');
            self.e.create('routeChanged');
            //
            self.addAcceptableType(Page);

            //initialize routing and history
            //setup hasher
            function parseHash(newHash, oldHash) {
                // when hash value changes, hasher invokes parseHash and we tell the router to parse the updated path/hash
                router.parse(newHash);

                self.e.routeChanged.dispatch(newHash, oldHash);
            }

            hasher.initialized.add(parseHash); // parse initial hash
            hasher.changed.add(parseHash); //parse hash changes
            hasher.init(); //start listening for history change
        };


        return Mixin([Widget, Attributable, Dispatchable, Containable], Application);
    });
