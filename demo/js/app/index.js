define(
    [
        'bkit/Application',
        'bkit/Page',
        'bkit/dowi/Button'
    ],
    function (Application, Page, Button) {
        console.log(new Application());
        a = Button({signal_linger_time: 123}), b = new Button({b: 90});
        console.log(a, b);
    });
