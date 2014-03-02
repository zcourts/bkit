define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'lib/text!bkit/dowi/tpl/Button.html',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button(options) {
            console.log(this);
        }

        Button.prototype.init = function (options) {
            console.log(this);
            this.options = options || {};
            this.options.label = 'Button';
            //console.log(this.signal_linger_time, this);
        };

        Button.prototype.setlabel = function (l) {
            //console.log(this)
            //this.options.label = l;
        };

        Button.prototype.type = module.id;
        window.Button = Button;
        return Mixin([Widget], Button);
    });
