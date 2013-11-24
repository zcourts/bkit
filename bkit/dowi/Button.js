define('bkit/dowi/Button', ['module', 'bkit/Mixin', 'text!bkit/dowi/tpl/Button.html', 'bkit/dowi/Widget',
    'bkit/Creator'],
    function (module, Mixin, template, Widget, Creator) {
        var Button = {
            type: module.id
        };
        Button = Mixin([Widget], Button);
        return Creator(Button);
    });
