define('bkit/App',
    [
        'module',
        'hasher',
        'crossroads',
        'underscore',
        'jquery',
        'bkit/Mixin',
        'bkit/View',
        'bkit/dowi/Widget',
        'bkit/dowi/Container',
        'bkit/Promise',
        'bkit/Util'
    ], function (module, hasher, crossroads, _, $, Mixin, View, Widget, Container, Promise, Util) {
        function App() {
        }

        App.prototype.namespace = 'bkit';
        App.prototype.type = module.id;
    });
