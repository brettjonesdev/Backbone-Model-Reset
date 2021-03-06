(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore","backbone"], function(_, Backbone) {
            // Use global variables if the locals are undefined.
            return factory(_ || root._, Backbone || root.Backbone);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(require("underscore"), require("backbone"));
    } else {
        // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
        factory(_, Backbone);
    }
}(this, function(_, Backbone) {
    Backbone.Model.prototype.reset = function(attrs, options) {
        attrs = attrs || {};
        if (options && options.parse) {
            attrs = this.parse(attrs, options) || {};
        }

        //get the attributes which are currently present but not present in the new attrs object
        var attributesToUnset = _.difference(_.keys(this.attributes), _.keys(attrs));
        var unsetObject = _.object(_.map(attributesToUnset, function(attr) {
            return [attr, undefined];
        }));
        //Must call `set` directly here, since `unset` Backbone helper fails to pass `options` in properly
        this.set(unsetObject, _.extend({}, options, {unset: true}));

        //set the attributes that are passed in, secure in knowledge that any old attributes not present were unset
        this.set(attrs, options);
    };
    return Backbone;
}));