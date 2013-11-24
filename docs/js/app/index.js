define(['bkit/Viewport', 'bkit/dowi/Button', 'bkit/dowi/Widget'],
    function (Viewport, Button, Widget) {
        console.log('Button', Button());
        console.log('Viewport', Viewport());
        console.log('Widget', Widget());

        console.log(new Button());
        return {
            a: 1,
            b: 2,
            c: 3
        }
    });
