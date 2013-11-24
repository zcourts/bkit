define('bkit/dowi/Container',
    ['module', 'bkit/Mixin', 'bkit/dowi/Widget'],
    function (module, Mixin, Widget) {
        var Container = {
            children: [],
            addChild: function (child) {
                if (this.isWidget(child)) {
                    this.children[child.hashCode()] = child;
                    //if not in dom then add to dom
                    //if domNode, not a child of this container, append to this container
                }
            }
        };
        return Mixin([Widget], Container);
    });