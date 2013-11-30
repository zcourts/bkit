define('bkit/View',
    [
        'module',
        'underscore',
        'bkit/Mixin',
        'bkit/dowi/Widget',
        'bkit/dowi/Container'
    ],
    function (module, _, Mixin, Widget, Container) {
        function View() {
            this.$('show');
            this.$('hide');
            this.connect(this.s.show, this.show);
        }

        View.prototype.isView = true;
        /**
         * Handles the show event triggered by an App instance.
         * @param app the app which this view must be rendered as a child of
         * @param pattern the pattern that matched
         * @param pathArgs* 1 or more arguments that were matched in the URL/pattern
         */
        View.prototype.show = function (app, pattern, pathArgs) {
            var container = this;
            _.each(this.children, function (child) {
                child._(child.s.rendered).then(function (signal) {
                    child.emit(signal, container);
                });
            });
        };

        View.prototype.type = module.id;

        return Mixin([Widget, Container], View);
    });