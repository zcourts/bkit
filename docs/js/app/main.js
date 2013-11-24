requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    paths: {
        //define JQuery's path
        jquery: 'jquery-2.0.3.min',
        signals: 'signals.min',
        underscore: 'underscore-min',
        app: '../app',
        //define BKit's base path relative to baseUrl
        bkit: '../../../bkit',
        bootstrap: "bootstrap.min"
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
        console.log(index)
    });
