define('bkit/dowi/layout/Grid',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/dowi/Widget',
        'bkit/dowi/Container'
    ],
    function (module, _, Mixin, Widget, Container) {
        function Grid() {
        }

        Grid.prototype.type = module.id;
        Grid.prototype.namespace = 'bkit';

        return Mixin([Widget, Container], Grid);
    });