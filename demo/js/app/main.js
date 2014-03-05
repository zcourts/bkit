requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    paths: {
        //BKit's dependencies
        //define JQuery's path
        jquery: 'lib/jquery-2.0.3.min',
        signals: 'lib/signals.min',
        underscore: 'lib/underscore-min',
        hasher: 'lib/hasher.min',
        crossroads: 'lib/crossroads.min',
        bootstrap: "lib/bootstrap.min",
        //define BKit's base path relative to baseUrl
        //bkit: '../../../bkit',
        //or as an absolute URL i.e. starts with /
        bkit: '/bkit',
        //define the App's path relative to baseUrl
        app: 'app'
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        underscore: {
            exports: '_'
        }

    }
});

requirejs(['app/index'],
    function (index) {
    });
