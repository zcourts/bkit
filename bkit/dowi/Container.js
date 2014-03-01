define('bkit/dowi/Container',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/dowi/Widget'
    ],
    function (module, _, Mixin, Widget) {
        function Container() {
            this.children = {};
            //this.connect(this.s.destroyed, this.destroy);
            //this.connect(this.s.setDomNode, this.setDomNode);
        }

        Container.prototype.type = module.id;

        /**
         * Adds a child to this container.
         * The child will then be managed by this container
         * @param {Widget} child the child to be added
         */
        Container.prototype.addChild = function (child) {
            if (child.isWidget) {
                this.children[child.instanceId()] = child;
            }
        };

        Container.prototype.destroy = function () {
            _.each(this.children, function (child) {
                child._(child.s.destroyed).then(function (signal) {
                    child.emit(signal, this)
                });
            }, this);
        };

        Container.prototype.setDomNode = function () {
            console.log(arguments)
        };
        return Mixin([Widget], Container);
    });
