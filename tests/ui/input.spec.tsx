declare let window: any;
declare let global: any, jest: any, jasmine: any, describe: any, clearTest: any, it: any, expect: any, beforeAll: any, beforeEach: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as TestRenderer from 'react-test-renderer';
configure({ adapter: new Adapter() });

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as enzyme from 'enzyme';

import { Input } from '../../src/';
import { InputPure } from '../../src/Input';

jest.mock('react-dom');

describe('Input', () => {
  let component: any;

  beforeEach(() => {
    component = enzyme.shallow(
        (
        <InputPure
          name='test input'
          registerInput={(inputName: string) => { return null; }}
        />
        ),
        {}
      );
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
          componentRenderer={(props: any) => {

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
    component.instance().handleInputChange('new value')
    component.update()
    expect(component.state('value')).toBe('new value')
    expect(component.state('isPristine')).toBe(false)
    expect(component).toMatchSnapshot();
  })

  it('updates its value on blur', () => {
    expect(component.state('isTouched')).toBe(false)
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

  // it('calls registerInput and getEventManager context method', () => {
  //   const mockRegisterInput = jest.fn()
  //   const mockGetEventManager = jest.fn()
  //   const mockGetValidationManager = jest.fn()
  //   const input = enzyme.shallow(
  //     (
  //       <Input name='intial value' value='some value' />
  //     ),
  //     {
  //       context: {
  //         strapActions: {
  //           registerInput: mockRegisterInput,
  //           getEventManager: mockGetEventManager,
  //           getValidationManager: mockGetValidationManager
  //         }
  //       }
  //     }
  //   )

  //   expect(mockRegisterInput.mock.calls.length).toBe(1)
  //   expect(mockRegisterInput.mock.calls[0][0]).toBe('intial value')
  //   expect(mockGetEventManager.mock.calls.length).toBe(1)
  //   expect(mockGetValidationManager.mock.calls.length).toBe(0)
  // })

  // it('calls getValidationManager context method', () => {
  //   const mockRegisterInput = jest.fn()
  //   const mockGetEventManager = jest.fn()
  //   const mockGetValidationManager = jest.fn()
  //   mockGetValidationManager.mockReturnValue({
  //     addValidator: jest.fn(),
  //   })
  //   const input = enzyme.shallow(
  //     (
  //       <Input name='intial value' value='some value' syncValidations={[(data, formData) => {
  //         const vr: ValidationResult = {
  //           resultType: EResultType.SUCCESS
  //         }
  //         return vr
  //       }]} />
  //     ),
  //     {
  //       context: {
  //         strapActions: {
  //           registerInput: mockRegisterInput,
  //           getEventManager: mockGetEventManager,
  //           getValidationManager: mockGetValidationManager
  //         }
  //       }
  //     }
  //   )

  //   expect(mockGetValidationManager.mock.calls.length).toBe(1)
  // })
});
