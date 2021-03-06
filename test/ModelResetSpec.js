var Backbone = require("backbone");
require('../backbone-model-reset');
describe('Model Reset tests', function () {
    describe('Test Backbone.Model.reset', function () {
        var model;
        beforeEach(function () {
            model = new Backbone.Model();
        });

        it('reset method is present', function () {
            expect(model).toBeDefined();
            expect(typeof model.reset).toEqual('function');
        });

        function expectChangeHandlerToHaveBeenCalledWith(changeHandler, expectedModelValues) {
            var changeHandlerModelArg = changeHandler.calls[0].args[0];
            expect(changeHandlerModelArg.attributes).toEqual(expectedModelValues);
        }

        it('model.reset() sets unsets and where appropriate, and triggers change events properly', function () {
            var originalAttributes = {
                a: 1,
                b: "2",
                c: "three"
            };
            model.set(originalAttributes);
            expect(model.toJSON()).toEqual(originalAttributes);


            var aChange = jasmine.createSpy('aChange');
            var bChange = jasmine.createSpy('bChange');
            var cChange = jasmine.createSpy('cChange');
            var dChange = jasmine.createSpy('dChange');
            model.on('change:a', aChange);
            model.on('change:b', bChange);
            model.on('change:c', cChange);
            model.on('change:d', dChange);

            //set all but c, and don't change b, and add d
            var newAttrs = {
                a: 0,
                b: "2",
                d: "four"
            };
            model.reset(newAttrs);

            //model.reset() fires appropriate change events
            expect(aChange).toHaveBeenCalled();
            expect(bChange).not.toHaveBeenCalled();
            expect(cChange).toHaveBeenCalled();
            expect(dChange).toHaveBeenCalled();

            //When change handlers are called, expect them to have _all_ of the changes from `reset`
            expectChangeHandlerToHaveBeenCalledWith(aChange, newAttrs);
            expectChangeHandlerToHaveBeenCalledWith(cChange, newAttrs);
            expectChangeHandlerToHaveBeenCalledWith(dChange, newAttrs);

            //model.reset() set/unset all attributes appropriately
            expect(model.get('c')).toBeUndefined();
            expect(model.toJSON()).toEqual(newAttrs);

            var changeHandler = jasmine.createSpy('changeHandler');
            model.on('change', changeHandler);

            model.reset();

            expect(changeHandler).toHaveBeenCalled();
            var changeHandlerModelArg = changeHandler.calls[0].args[0];
            expect(changeHandlerModelArg.toJSON()).toEqual({});
            expect(model.toJSON()).toEqual({});
        });

        it('model.reset() passes `options` into unset and set calls', function () {
            var originalAttributes = {
                a: 1,
                b: "2",
                c: "three"
            };
            model.set(originalAttributes);
            expect(model.toJSON()).toEqual(originalAttributes);


            var aChange = jasmine.createSpy('aChange');
            var bChange = jasmine.createSpy('bChange');
            var cChange = jasmine.createSpy('cChange');
            var dChange = jasmine.createSpy('dChange');
            model.on('change:a', aChange);
            model.on('change:b', bChange);
            model.on('change:c', cChange);
            model.on('change:d', dChange);

            //set all but c, and don't change b, and add d
            var newAttrs = {
                a: 0,
                b: "2",
                d: "four"
            };
            //`silent: true` should prevent callbacks from firing
            model.reset(newAttrs, {silent: true});

            //model.reset() fires appropriate change events
            expect(aChange).not.toHaveBeenCalled();
            expect(bChange).not.toHaveBeenCalled();
            expect(cChange).not.toHaveBeenCalled();
            expect(dChange).not.toHaveBeenCalled();

            //model.reset() set/unset all attributes appropriately
            expect(model.get('c')).toBeUndefined();
            expect(model.toJSON()).toEqual(newAttrs);
        })
    });
});
