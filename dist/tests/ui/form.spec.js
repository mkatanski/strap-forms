"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof jasmine !== 'undefined')
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
var enzyme_1 = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");
enzyme_1.configure({ adapter: new Adapter() });
var React = require("react");
var enzyme = require("enzyme");
var _1 = require("../../src/");
describe('Form', function () {
    it('renders with default component and children', function () {
        var wrapper = enzyme.shallow((React.createElement(_1.Form, { name: 'test form' },
            React.createElement("div", null, "children component"))), {});
        expect(wrapper).toMatchSnapshot();
    });
    it('accepts strap inputs as children (use of contexts registerInput)', function () {
        var validator = function (data) {
            if (data.value === 'wrong') {
                return {
                    code: 100,
                    message: 'Wrong content',
                    resultType: _1.EResultType.ERROR
                };
            }
            return { resultType: _1.EResultType.SUCCESS };
        };
        var wrapper = enzyme.mount((React.createElement(_1.Form, { name: 'test form with children' },
            React.createElement(_1.Input, { name: 'input1', syncValidations: [validator] }))), {});
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=form.spec.js.map