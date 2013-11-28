define('bkit/Viewport', ['bkit/Mixin', 'bkit/dowi/Widget'], function (Mixin, Widget) {
    function Viewport() {
        this.size = {}
    }

    Viewport = Mixin([Widget], Viewport);
    return Viewport;
});
