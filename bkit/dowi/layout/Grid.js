define('bkit/dowi/layout/Grid',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/Widget',
        'bkit/Container'
    ],
    function (module, _, Mixin, Widget, Container) {
        function Grid() {
        }

        Grid.prototype.type = module.id;
        Grid.prototype.namespace = 'this';

        return Mixin([Widget, Container], Grid);
    });
