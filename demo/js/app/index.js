define(
    [
        'bkit/Application',
        'bkit/Page',
        'bkit/dowi/Button'
    ],
    function (Application, Page, Button) {
        app = new Application();
        page1 = new Page({route: '/abc'});
        console.log(app.addChild(page1));
        console.log(app.addChild(new Button()));
        console.log(app);
    });
