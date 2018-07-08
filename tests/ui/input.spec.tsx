import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as TestRenderer from 'react-test-renderer';
configure({ adapter: new Adapter() });

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as enzyme from 'enzyme';

import { Input } from '../../src/Input';
import { InputPure } from '../../src/Input';
import { StrapEventType, ValidationResultType, TValidationResult  } from '../../src/common'

jest.mock('react-dom');

enum riArg {
  inputName = 0,
  inputState = 1,
  onEvent = 2
}

describe('Input', () => {
  let registerInputMock: any;

  const getPureInput = (props: any): any => enzyme.shallow(
    (<InputPure
        registerInput={registerInputMock}
        {...props}
    />), {}
  );

  const registerInputCalls = () =>
    registerInputMock.mock.calls

  const registerInputCall = (callNumber: number = 0) =>
    registerInputMock.mock.calls[callNumber]

  beforeEach(() => {
    registerInputMock = jest.fn();
  })

  describe('basic checks', () => {
    let component: any;

    beforeEach(() => {
      component = enzyme.shallow(
          (<InputPure
            name='test input'
            registerInput={jest.fn()}
          /> ), {} );
    })

    it('renders with default component', () => {
      expect(component).toMatchSnapshot();
    });

    it('renders with default component and initial value', () => {
      const input = TestRenderer.create(
        (
          <Input name='defaultInput' value='some value' />
        ),
      );
      expect(input).toMatchSnapshot();
    });

    it('renders with custom class name', () => {
      const input = TestRenderer.create(
        (
          <Input name='customClassName' className='customCssClass' />
        ),
      );
      expect(input).toMatchSnapshot();
    });

    it('renders with custom component', () => {
      const input = TestRenderer.create(
        (
          <Input
            name='customRenderer'
            className='customCssClass'
            render={(props: any) => {

              return (
                <div>
                  name: {props.name}
                  className: {props.className}
                </div>
              )
            }}
          />
        ),
      );
      expect(input).toMatchSnapshot();
    })


    it('updates its value on change', () => {
      expect(component.state('isPristine')).toBe(true)
      expect(component.state('isValid')).toBe(false)
      component.instance().handleInputChange('new value')
      component.update()
      expect(component.state('value')).toBe('new value')
      expect(component.state('isPristine')).toBe(false)
      expect(component).toMatchSnapshot();
    })

    it('updates its value on blur', () => {
      expect(component.state('isTouched')).toBe(false)
      expect(component.state('isValid')).toBe(false)
      component.instance().handleInputBlur('new value on blur')
      component.update()
      expect(component.state('value')).toBe('new value on blur')
      expect(component.state('isTouched')).toBe(true)
      expect(component).toMatchSnapshot();
    })

    it('updates its value when prop is changed', () => {
      component.instance().handleInputChange('new value')
      component.update()

      component.setProps({ value: 'changed value' });
      component.update()
      expect(component.state('value')).toBe('changed value')
      expect(component).toMatchSnapshot();
    })
  })

  describe('registerInput method', () => {
      it('calls registerInput context method', () => {
        const input = getPureInput({
          name: 'MyInput',
        })

        expect(registerInputCalls().length).toBe(1)
        expect(registerInputCall()[riArg.inputName]).toBe('MyInput')
      })
  })

  describe('validation', () => {
    it('calls validation method onInputChange', () => {
      const validateMethod = jest.fn();
      const input = getPureInput({
        name: 'MyPureInput',
        onValidate: validateMethod
      })

      input.instance().handleInputChange('some value to validate');
      expect(input.state('value')).toBe('some value to validate');
      expect(validateMethod.mock.calls.length).toBe(0);

      // set input as touched
      input.setState({
        isTouched: true
      })

      input.instance().handleInputChange('some value to validate');
      expect(validateMethod.mock.calls.length).toBe(1);
      expect(validateMethod.mock.calls[0][0]).toBe('MyPureInput');
      expect(validateMethod.mock.calls[0][1]).toBe('some value to validate');
    })

    it('calls validation method onInputChange untouched', () => {
      const validateMethod = jest.fn();
      const input = getPureInput({
        name: 'MyPureInput',
        validateUntouched: true,
        onValidate: validateMethod
      })

      input.instance().handleInputChange('some value to validate');
      expect(validateMethod.mock.calls.length).toBe(1);
      expect(validateMethod.mock.calls[0][0]).toBe('MyPureInput');
      expect(validateMethod.mock.calls[0][1]).toBe('some value to validate');
    })

    it('calls validation method onInputBlur', () => {
      const validateMethod = jest.fn();
      const input = getPureInput({
        name: 'MyPureInput2',
        onValidate: validateMethod
      })

      input.instance().handleInputBlur('some another value to validate');
      expect(input.state('value')).toBe('some another value to validate');
      expect(validateMethod.mock.calls.length).toBe(1);
      expect(validateMethod.mock.calls[0][0]).toBe('MyPureInput2');
      expect(validateMethod.mock.calls[0][1]).toBe('some another value to validate');
    })
  })

  describe('events', () => {
    let eventCallback;
    let input;

    beforeEach(() => {
      input = getPureInput({
        name: 'MyInput',
        registerInput: (name, callback) => {
          eventCallback = callback;
        }
      });
    })

    it('should assign callback function on input registration', () => {
      const onValidationCompleteMock = jest.fn();
      input.instance().onValidationComplete = onValidationCompleteMock;
      const mockCalls = onValidationCompleteMock.mock.calls;
      expect(eventCallback).toBeDefined();
      expect(mockCalls.length).toBe(0);
    })

    it('should call onValidationComplete', () => {
      const onValidationCompleteMock = jest.fn();
      input.instance().onValidationComplete = onValidationCompleteMock;
      const mockCalls = onValidationCompleteMock.mock.calls;

      const validationResult: TValidationResult = {
        type: ValidationResultType.Success,
        message: 'success message'
      }

      eventCallback({
        type: StrapEventType.onValidateDone,
        data: validationResult
      });

      expect(mockCalls.length).toBe(1);
      expect(mockCalls[0][0]).toEqual({
        type: ValidationResultType.Success,
        message: 'success message'
      });
    })

    it('should has valid state when validation is complete', () => {
      const validationResult: TValidationResult = {
        type: ValidationResultType.Success,
      }

      expect(input.state('isValid')).toBe(false);

      eventCallback({
        type: StrapEventType.onValidateDone,
        data: validationResult
      });

      expect(input.state('isValid')).toBe(true);
    })

    it('should has invalid state when validation is complete and result is error', () => {
      const validationResult: TValidationResult = {
        type: ValidationResultType.Error,
      }

      input.setState({ isValid: true });

      expect(input.state('isValid')).toBe(true);

      eventCallback({
        type: StrapEventType.onValidateDone,
        data: validationResult
      });

      expect(input.state('isValid')).toBe(false);
    })

    it('should has invalid state when validation is complete and result is warning', () => {
      const validationResult: TValidationResult = {
        type: ValidationResultType.Warning,
      }

      input.setState({ isValid: true });

      expect(input.state('isValid')).toBe(true);

      eventCallback({
        type: StrapEventType.onValidateDone,
        data: validationResult
      });

      expect(input.state('isValid')).toBe(false);
    })

  })

});
