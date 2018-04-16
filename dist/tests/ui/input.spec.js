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
describe('Input', function () {
    var component;
    beforeEach(function () {
        component = enzyme.shallow((React.createElement(_1.Input, { name: 'test input' })), {});
    });
    it('renders with default component', function () {
        expect(component).toMatchSnapshot();
    });
    it('renders with default component and initial value', function () {
        var input = enzyme.shallow((React.createElement(_1.Input, { name: 'intial value', value: 'some value' })), {});
        expect(input).toMatchSnapshot();
    });
    it('updates its value on change', function () {
        component.instance().handleInputChange('new value');
        component.update();
        expect(component.state('value')).toBe('new value');
        expect(component).toMatchSnapshot();
    });
    it('updates its value on blur', function () {
        component.instance().handleInputBlur('new value on blur');
        component.update();
        expect(component.state('value')).toBe('new value on blur');
        expect(component).toMatchSnapshot();
    });
    it('updates its value when prop is changed', function () {
        component.instance().handleInputChange('new value');
        component.update();
        component.setProps({ value: 'changed value' });
        component.update();
        expect(component.state('value')).toBe('changed value');
        expect(component).toMatchSnapshot();
    });
    it('calls registerInput and getEventManager context method', function () {
        var mockRegisterInput = jest.fn();
        var mockGetEventManager = jest.fn();
        var mockGetValidationManager = jest.fn();
        var input = enzyme.shallow((React.createElement(_1.Input, { name: 'intial value', value: 'some value' })), {
            context: {
                strapActions: {
                    registerInput: mockRegisterInput,
                    getEventManager: mockGetEventManager,
                    getValidationManager: mockGetValidationManager
                }
            }
        });
        expect(mockRegisterInput.mock.calls.length).toBe(1);
        expect(mockRegisterInput.mock.calls[0][0]).toBe('intial value');
        expect(mockGetEventManager.mock.calls.length).toBe(1);
        expect(mockGetValidationManager.mock.calls.length).toBe(0);
    });
    it('calls getValidationManager context method', function () {
        var mockRegisterInput = jest.fn();
        var mockGetEventManager = jest.fn();
        var mockGetValidationManager = jest.fn();
        mockGetValidationManager.mockReturnValue({
            addValidator: jest.fn(),
        });
        var input = enzyme.shallow((React.createElement(_1.Input, { name: 'intial value', value: 'some value', syncValidations: [function (data, formData) {
                    var vr = {
                        resultType: _1.EResultType.SUCCESS
                    };
                    return vr;
                }] })), {
            context: {
                strapActions: {
                    registerInput: mockRegisterInput,
                    getEventManager: mockGetEventManager,
                    getValidationManager: mockGetValidationManager
                }
            }
        });
        expect(mockGetValidationManager.mock.calls.length).toBe(1);
    });
});
//# sourceMappingURL=input.spec.js.map