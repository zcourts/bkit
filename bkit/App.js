define('bkit/App',
    [
        'module',
        'bkit/Mixin',
        'bkit/dowi/Widget',
        'bkit/dowi/Container',
        'hasher',
        'crossroads',
        'underscore'
    ], function (module, Mixin, Widget, Container, Hasher, Crossroads, _) {
        function App() {
            //  console.log(Hasher, Crossroads, _);
        }

        App.prototype.addRoute = function (path, view) {

        };
        App.prototype.type = module.id;
        var app = Mixin([Widget, Container], App),
            instances = {};
        return {
            /**
             * Create an application instance with the given name or return the existing one
             * @param name the name of the application instance to fetch, if falsy "main" is used as the name
             * @returns {App}
             */
            instance: function (name) {
                return instances[name ? name : 'main'] ?
                    instances[name ? name : 'main'] :
                    instances[name ? name : 'main'] = new app();
            }
        }
    });
