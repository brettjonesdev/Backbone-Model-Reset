# Backbone-Model-Reset
Extends Backbone.Model with a `reset` method like Backbone.Collection has.

As described in [this Backbone issue conversation](https://github.com/jashkenas/backbone/issues/3253), Backbone.Model lacks a `reset` method like Backbone.Collection has.  The workaround when you want to reset/replace a Model's state is to do the following:

```javascript
model.clear().set(attrs);
```

But using `clear` guarantees a `change:*` event for every single attribute on the model, along with a second `change:*` event for those attributes which are specified in `attrs`.  Attributes which didn't _really_ change will instead have two change events.  This might not matter if your application doesn't listen to model change events, but if it does, this can lead to lots of unnecessary change events.

What if we add `silent: true` to the `clear()` call?

```javascript
model.clear({silent:true}).set(attrs);
```

This is better in that we don't have a bunch of needless `change:` events, but it has a hole: if the model has an attribute which is not specified in `attrs`, it will get unset, but will _not_ have its `change:*` event fire.  This also can cause problems in applications which listen for change events on any such attributes.

What is really needed is a `reset` method which _replaces_ the Model's state, firing change events only for those attributes which changed, _or_ which were unset.

This repo extends `Backbone.Model.prototype` with just such a method.  If you want to see how it works in more detail, check out the [Spec file](test/ModelResetSpec.js).

### Contributing

You can run tests with `grunt test`