define(['bkit/Viewport', 'bkit/dowi/Button', 'bkit/dowi/Widget'],
    function (Viewport, Button, Widget) {
        console.log(window.btn = new Button());
        window.b = Button;
        return {
            a: 1,
            b: 2,
            c: 3
        }
    });
