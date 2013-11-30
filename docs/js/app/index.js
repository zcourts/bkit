define(
    [
        'bkit/App',
        'bkit/View',
        'bkit/dowi/Button'
    ],
    function (App, View, Button) {
        var app = App.instance();
        var home = new View(),
            auth = new View(),
            homeBtn = new Button({attr: {text: 'Home Button'}}),
            authBtn = new Button({attr: {text: 'Auth Button'}});

        home.addChild(homeBtn);
        auth.addChild(authBtn);

        var homeId = app.addView('/', home),
            authId = app.addView('auth', auth);

        app.startRouting();
        window.homeId = homeId;
        window.authId = authId;
    });
