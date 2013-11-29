define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'text!bkit/dowi/tpl/Button.html',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button() {
            var $this = this;
//            this.connect(this.s.setTemplate, function (template) {
//                console.log('set template btn', template)
//            });
            //this.emit(this.s.setTemplate, template);
            this._(this.s.setTemplate).then(function (signal) {
                this.emit(signal, template);
            })
        }

        Button.prototype.type = module.id;
        window.Button = Button;
        return Mixin([Widget], Button);
    });
