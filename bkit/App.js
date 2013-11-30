define('bkit/App',
    [
        'module',
        'hasher',
        'crossroads',
        'underscore',
        'jquery',
        'bkit/Mixin',
        'bkit/View',
        'bkit/dowi/Widget',
        'bkit/dowi/Container',
        'bkit/Promise',
        'bkit/Util'
    ], function (module, hasher, crossroads, _, $, Mixin, View, Widget, Container, Promise, Util) {

        function App(container) {
            //path -> view
            this.routesByPath = {};
            //hash -> path
            this.routesByHash = {};
            this.view = null;
            this.$('_route');//create set route event
            this.$('route');
            this._(this.s.setDomNode).then(function (signal) {
                this.emit(signal, $(container)[0]);
            });
        }

        /**
         * Tell the app to start listening for routing changes
         */
        App.prototype.startRouting = function () {
            hasher.init();
            hasher.initialized.add(function (val, oldVal) {
                crossroads.parse(val);
            }, this);
            this.connect(this.s._route, function (val) {
                //match paths and generate history
                crossroads.parse(val);
            });
            hasher.changed.add(this.setRoute, this); //listen for all future changes
        };

        /**
         * Automatically triggered when the browser's hash path changes
         * @param val the new path
         * @param oldVal the old path
         */
        App.prototype.setRoute = function (val, oldVal) {
            this._(this.s._route).then(function (signal) {
                this.emit(signal, val, oldVal);
            });
        };

        /**
         * Manually show a view.
         * @param args  if the view requires certain arguments in the URL e.g.
         * in a pattern such as /news/{id}/    if args is set to {id:123}
         * a history record is generated for /news/123 and id = 123 is set as an argument when the view is invoked
         * @param id  a path, ID or a promise
         * @param isHash if true then id is treated as the hash returned when addRoute is called
         */
        App.prototype.showView = function (args, id, isHash) {
            var view;
            if (id.isPromise) {
                id.then(function (realId) {
                    id = realId;
                })
            }

            if (isHash) {
                view = this.routesByPath[this.routesByHash[id]];
            } else {
                view = this.routesByPath[id];
            }
            if (view) {
                this.switchView(view, _.toArray(arguments).splice(2));
                if (view.route) {
                    //must call setHash manually because crossroads.parse is not used
                    hasher.setHash(view.route.interpolate(args));
                }
            }
        };

        /**
         * Adds a view which is rendered when the browser's hash changes
         * @param {String|RegExp} pattern  String pattern or Regular Expression that should be used to match against requests.
         If pattern is a String it can contain named variables surrounded by "{}" that will be evaluated and passed to handlers as parameters. Each pattern segment is limited by the "/" char, so named variables will match anything until it finds a "/" char or the next string token located after the variable.
         The pattern "{foo}/{bar}" will match "lorem/ipsum-dolor" but won't match "lorem/ipsum-dolor/sit". Trailing slashes at the end/begin of the request are ignored by default, so /{foo}/ matches same requests as {foo}. - If you need to match segments that may contain "/" use a regular expression instead of a string pattern.
         A pattern can also have optional segments, which should be surrounded by "::" (e.g. "news/:foo:/:bar:" will match "news", "news/123" and "news/123/asd")
         If pattern is a RegExp, capturing groups will be passed as parameters to handlers on the same order as they were matched.
         It also allows "rest" segments (ending with *) which can match multiple segments. Rest segments can be optional and/or required and don't need to be the last segment of the pattern. The pattern "{foo}/:bar*:" will match news "news/123", "news/123/bar", "news/123/lorem/ipsum".
         * @param view  the view on which the "show" event will be triggered
         * @param priority
         * @returns {Promise}
         */
        App.prototype.addView = function (pattern, view, priority) {
            var id;
            if (pattern && view && view.isView) {
                var route = crossroads.addRoute(pattern, undefined, priority);
                route.matched.add(function () {
                    this.switchView(view, arguments)
                }, this);
                view.route = route;
                id = Util.hash(pattern);
                this.routesByHash[id] = pattern;
                this.routesByPath[pattern] = view;
            }
            return new Promise(id, this, id);
        };

        /**
         * Manually switch a view without generating a history record.
         * This is automatically called if routing is started
         * @param {View} view the view to switch too
         * @param {array} args an array of arguments to be passed to the view's show event listener
         */
        App.prototype.switchView = function (view, args) {
            var app = this;
            args = _.union([this], _.toArray(args));
            //when match app should
            //trigger hide on current view
            app.view ? app.view.emit(app.view.s.hide) : '';
            // clear it's contents
            app.domNode.html('');
            //set the app's current view after hiding the previous one
            app.view = view;
            //set the view's domNode to the App's
            app.view.emit(app.view.s.setDomNode, app.domNode);
            //emit route event on the App object even if the view doesn't show
            this.emit.apply(this, _.union([this.s.route], args));
            //trigger show on the view
            app.view.emit.apply(this, _.union([app.view.s.show], args));
        };

        App.prototype.type = module.id;
        var app = Mixin([Widget], App),
            instances = {};

        return {
            /**
             * Create an application instance with the given name or return the existing one
             * @param name the name of the application instance to fetch, if falsy "main" is used as the name
             * @param container the container to which the application instance and it's children are added.
             * if not specified then body is used
             * @returns {App}
             */
            instance: function (name, container) {
                return instances[name ? name : 'main'] ?
                    instances[name ? name : 'main'] :
                    instances[name ? name : 'main'] = new app(container ? container : 'body');
            }
        }
    });
