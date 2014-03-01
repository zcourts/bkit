define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'lib/text!bkit/dowi/tpl/Button.html',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button(options) {
            this.options = options || {};
            this.options.label = 'Button';
        }

        Button.prototype.setlabel = function (l) {
            this.options.label = l;
        };

        Button.prototype.type = module.id;
        window.Button = Button;
        return Mixin([Widget], Button);
    });
