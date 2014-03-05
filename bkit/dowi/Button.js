define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'lib/text!bkit/dowi/tpl/Button.html',
        'bkit/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button(options) {
        }

        Button.prototype.type = module.id;
        Button.prototype.namespace = 'this';
        Button.prototype.defaults = {label: 'Button'};

        Button.prototype.init = function (self) {
        };

        return Mixin([Widget], Button);
    });
