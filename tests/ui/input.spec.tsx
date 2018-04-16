declare let window: any;
declare let global: any, jest: any, jasmine: any, describe: any, clearTest: any, it: any, expect: any, beforeAll: any, beforeEach: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import * as React from 'react';
import * as enzyme from 'enzyme';

import { Input, ValidationResult, EResultType } from '../../src/';

describe('Input', () => {
  let component: any;

  beforeEach(() => {
    component = enzyme.shallow(
      (
        <Input name='test input' />
      ),
      {}
    );
  })

  it('renders with default component', () => {
    expect(component).toMatchSnapshot();
  });

  it('renders with default component and initial value', () => {
    const input = enzyme.shallow(
      (
        <Input name='intial value' value='some value' />
      ),
      {}
    );
    expect(input).toMatchSnapshot();
  });

  it('updates its value on change', () => {
    component.instance().handleInputChange('new value')
    component.update()
    expect(component.state('value')).toBe('new value')
    expect(component).toMatchSnapshot();
  })

  it('updates its value on blur', () => {
    component.instance().handleInputBlur('new value on blur')
    component.update()
    expect(component.state('value')).toBe('new value on blur')
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

  it('calls registerInput and getEventManager context method', () => {
    const mockRegisterInput = jest.fn()
    const mockGetEventManager = jest.fn()
    const mockGetValidationManager = jest.fn()
    const input = enzyme.shallow(
      (
        <Input name='intial value' value='some value' />
      ),
      {
        context: {
          strapActions: {
            registerInput: mockRegisterInput,
            getEventManager: mockGetEventManager,
            getValidationManager: mockGetValidationManager
          }
        }
      }
    )

    expect(mockRegisterInput.mock.calls.length).toBe(1)
    expect(mockRegisterInput.mock.calls[0][0]).toBe('intial value')
    expect(mockGetEventManager.mock.calls.length).toBe(1)
    expect(mockGetValidationManager.mock.calls.length).toBe(0)
  })

  it('calls getValidationManager context method', () => {
    const mockRegisterInput = jest.fn()
    const mockGetEventManager = jest.fn()
    const mockGetValidationManager = jest.fn()
    mockGetValidationManager.mockReturnValue({
      addValidator: jest.fn(),
    })
    const input = enzyme.shallow(
      (
        <Input name='intial value' value='some value' syncValidations={[(data, formData) => {
          const vr: ValidationResult = {
            resultType: EResultType.SUCCESS
          }
          return vr
        }]} />
      ),
      {
        context: {
          strapActions: {
            registerInput: mockRegisterInput,
            getEventManager: mockGetEventManager,
            getValidationManager: mockGetValidationManager
          }
        }
      }
    )

    expect(mockGetValidationManager.mock.calls.length).toBe(1)
  })
});
