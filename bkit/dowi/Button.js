define('bkit/dowi/Button', ['module', 'bkit/Mixin', 'text!bkit/dowi/tpl/Button.html', 'bkit/dowi/Widget',
    'bkit/Creator'],
    function (module, Mixin, template, Widget, Creator) {
        function Button() {
            this.type = module.id;
            console.log('btn')
        }

//        Button.prototype.connect = function () {
//            console.log('does nothing')
//        };
//        return Mixin([
//            {
//                name: 'bkit/dowi/Widget',
//                force: ['connect'] //allow widget's connect to override the one defined here
//            }
//        ], Button);
        return Mixin([Widget], Button);
    });
