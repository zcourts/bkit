define('bkit/dowi/Button',
    [
        'module',
        'bkit/Mixin',
        'text!bkit/dowi/tpl/Button.html',
        'bkit/dowi/Widget'
    ],
    function (module, Mixin, template, Widget) {
        function Button(args) {
            var $this = this;
            this._(this.s.setTemplate).then(function (signal) {
                this.emit(signal, template);
            });
            this.connect(this.s.setDomNode, function () {
                if (args.attr) {
                    this.domNode.attr(args.attr);
                    if (args.attr.text) {
                        this.domNode.text(args.attr.text)
                    }
                }
            });
        }

        Button.prototype.type = module.id;
        window.Button = Button;
        return Mixin([Widget], Button);
    });
