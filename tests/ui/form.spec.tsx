declare let window: any;
declare let global: any, jasmine: any, describe: any, clearTest: any, it: any, expect: any, beforeAll: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import * as React from 'react';
import * as enzyme from 'enzyme';

import { Form, Input, TSyncValidationMethod, ValidationResult, EResultType } from '../../src/';

describe('Form', () => {
  it('renders with default component and children', () => {
    const wrapper = enzyme.shallow(
      (
        <Form name='test form'>
          <div>children component</div>
        </Form>
      ),
      {}
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('accepts strap inputs as children (use of contexts registerInput)', () => {
    const validator: TSyncValidationMethod = (data): ValidationResult => {
      if (data.value === 'wrong') {
        return {
          code: 100,
          message: 'Wrong content',
          resultType: EResultType.ERROR
        }
      }

      return { resultType: EResultType.SUCCESS }
    }
    const wrapper = enzyme.mount(
      (
        <Form name='test form with children'>
          <Input name='input1' syncValidations={[validator]} />
        </Form>
      ),
      {}
    );
    expect(wrapper).toMatchSnapshot();
  })
});
