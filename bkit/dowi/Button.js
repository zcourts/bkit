define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'lib/text!bkit/dowi/tpl/Button.html',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button(options) {
        }

        Button.prototype.type = module.id;
        Button.prototype.namespace = 'bkit';
        Button.prototype.defaults = {label: 'Button'};

        Button.prototype.init = function (self) {
        };

        return Mixin([Widget], Button);
    });
