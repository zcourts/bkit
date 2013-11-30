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
            notFound = new View(),
            nfBtn = new Button({attr: {text: 'Not found'}}),
            homeBtn = new Button({attr: {text: 'Home Button'}}),
            authBtn = new Button({attr: {text: 'Auth Button'}});
        app.notFound = notFound;

        home.addChild(homeBtn);
        auth.addChild(authBtn);
        notFound.addChild(nfBtn);

        app.connect(app.s.route_missing, function () {
            app.switchView(notFound);
        });
        var homeId = app.addView('/', home),
            authId = app.addView('auth', auth);

        app.startRouting();
        window.homeId = homeId;
        window.authId = authId;
    });
