declare let window: any;
declare let global: any, jest: any, jasmine: any, describe: any, clearTest: any, it: any, expect: any, beforeAll: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as TestRenderer from 'react-test-renderer';
configure({ adapter: new Adapter() });

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as enzyme from 'enzyme';

import { Form, Input } from '../../src/';
import { Consumer } from '../../src/Form'

jest.mock('react-dom');

describe('Form', () => {
  it('renders with default component and children', () => {
    const component = TestRenderer.create((
      <Form name='test form'>
        <div>some children component</div>
      </Form>
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('accepts inputs as children and call registerInput', () => {
    const registerSpy = jest.spyOn(Form.prototype, 'registerInput')
    const component = TestRenderer.create((
      <Form name='test form with input'>
          <Input name='input1' value='test' />
      </Form>
    ));

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy.mock.calls.length).toBe(1);
    expect(registerSpy).toBeCalledWith('input1', {
      "isPristine": true,
      "isTouched": false,
      "isValid": false,
      "value": "test",
    });
  })

  it('renders with custom component and calls registerInput', () => {
    const registerSpy = jest.spyOn(Form.prototype, 'registerInput')
    const component = TestRenderer.create((
      <Form
        name='customComponent'
        componentRenderer={props => {
          return (
            <div>
              {props.children}
            </div>
          )
        }}
      >
          <Input name='input2' />
      </Form>
    ));

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy.mock.calls.length).toBe(2);
    expect(registerSpy).toBeCalledWith('input2', {
      "isPristine": true,
      "isTouched": false,
      "isValid": false,
      "value": "",
    });
  })
});
