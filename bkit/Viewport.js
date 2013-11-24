define('bkit/Viewport', ['bkit/Mixin', 'bkit/dowi/Widget'], function (Mixin, Widget) {
    var viewport = {
        size: {}
    };
    viewport = Mixin([Widget], viewport);

    return viewport;
});
