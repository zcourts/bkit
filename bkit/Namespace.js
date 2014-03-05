define('bkit/Namespace', [], function () {
    /**
     * Defines a localized scope within which, all references to 'this' refers.
     * i.e. within a namespace, 'this' does not refer to the instance's scope but instead to the namespace.
     * All mixins within the same namespace share the same scope.
     * So if an object as a namespace a.b
     * a and b are two different scopes i.e. a != b
     * If a function defined in a refers to this.name and another function in b also refers to this.name
     * the values returned are not shared.
     * However, if two functions defined within the same namespace, for example a, refers to this.name
     * the two functions will be accessing a shared value.
     * @global
     * @constructor
     */
    function Namespace() {
    }

    return Namespace;
});
