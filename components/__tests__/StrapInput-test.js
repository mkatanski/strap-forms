/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React, { Component } from 'react'
import T from 'prop-types'
import renderer from 'react-test-renderer'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import StrapInput from '../StrapInput'
import { StrapFormContextTypes } from '../StrapForm'

configure({ adapter: new Adapter() })

const fetchSimulate = ms => new Promise(resolve => setTimeout(resolve, ms))

class ContextWrapper extends Component {
  static propTypes = {
    children: T.any.isRequired,
  }

  static childContextTypes = {
    ...StrapFormContextTypes,
  }

  getChildContext() {
    return {
      listenTo: () => { },
      dispatchEvent: () => { },
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

class PureInput extends Component {
  render() {
    // eslint-disable-next-line
    const { input, className } = this.props

    return (
      <div>
        <input {...input} className={className} />
        <span>{JSON.stringify(this.props)}</span>
      </div>
    )
  }
}

const TestInput = StrapInput(PureInput)

describe('StrapInput', () => {
  const checkChange = async (done, method, options) => {
    const { val, validate, warn, expected, disabled, readOnly, asyncValidation } = options
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()

    const component = shallow(
      (
        <TestInput
          name="test_input_name"
          validate={validate}
          warn={warn}
          asyncValidation={asyncValidation}
          disabled={!!disabled}
          readOnly={!!readOnly}
        />
      ),
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )

    const instance = component.instance()

    expect(component.state('touched')).toBe(false)
    expect(component.state('value')).toBe('')
    expect(mockDispatchEvent.mock.calls.length).toBe(0)

    await instance[method](val)

    if (expected.asyncMessage) {
      expect(mockDispatchEvent.mock.calls.length).toBe(3)
      expect(mockDispatchEvent.mock.calls[0][0]).toBe('onBeforeAsyncValidation')
      expect(mockDispatchEvent.mock.calls[0][1]).toEqual({
        inputName: 'test_input_name',
        value: val,
      })
      expect(mockDispatchEvent.mock.calls[1][0]).toBe('onAfterAsyncValidation')
      expect(mockDispatchEvent.mock.calls[1][1]).toEqual({
        inputName: 'test_input_name',
        message: expected.asyncMessage,
      })

      expect(mockDispatchEvent.mock.calls[2][0]).toBe(expected.eventName)
      expect(mockDispatchEvent.mock.calls[2][1]).toEqual({
        errors: expected.errors,
        inputName: 'test_input_name',
        isValid: expected.isValid,
        value: val,
        warnings: expected.warnings,
      })
    } else {
      expect(mockDispatchEvent.mock.calls.length).toBe(1)
      expect(mockDispatchEvent.mock.calls[0][0]).toBe(expected.eventName)
      expect(mockDispatchEvent.mock.calls[0][1]).toEqual({
        errors: expected.errors,
        inputName: 'test_input_name',
        isValid: expected.isValid,
        value: val,
        warnings: expected.warnings,
      })
    }

    expect(component.state('touched')).toBe(expected.touched)
    expect(component.state('value')).toBe(val)
    done()
  }

  it('can be rendered without problems with default values', () => {
    const component = renderer.create(
      <ContextWrapper>
        <TestInput name="test_input_name" />
      </ContextWrapper>
    )

    const input = component.toJSON()
    expect(input).toMatchSnapshot()
  })

  it('can be rendered without problems with initial value', () => {
    const component = renderer.create(
      <ContextWrapper>
        <TestInput
          name="test_input_name"
          initialValue="init value"
          className="customProperty"
        />
      </ContextWrapper>
    )

    const input = component.toJSON()
    expect(input).toMatchSnapshot()
  })

  it('can be rendered without problems as disabled and readonly', () => {
    const component = renderer.create(
      <ContextWrapper>
        <TestInput
          name="test_input_name"
          disabled
          readOnly
        />
      </ContextWrapper>
    )

    const input = component.toJSON()
    expect(input).toMatchSnapshot()
  })

  it('changes state after onBlur event is triggered with no validation', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'test_value',
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('changes state after onBlur event is triggered with warn', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'test_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { },
        warnings: { 0: 'Warning message' },
        isValid: true,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('changes state after onBlur event is triggered with warn and error', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { 0: 'Error message' },
        warnings: { 0: 'Warning message' },
        isValid: false,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('changes state after onBlur event is triggered without warn or error', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'ttt',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('shows no error if the input is disabled', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      disabled: true,
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('shows no error if the input is readOnly', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      readOnly: true,
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('will not async validate if there is sync error onBlur', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      asyncValidation: value => fetchSimulate(1000).then(() => {
        if (value === 'invalid_value') {
          throw new Error('This name is forbidden')
        }
      }),
      expected: {
        errors: { 0: 'Error message' },
        warnings: { },
        isValid: false,
        eventName: 'onInputBlur',
        touched: true,
      },
    })
  })

  it('will show async error onBlur', async (done) => {
    await checkChange(done, 'handleOnBlur', {
      val: 'invalid_value_async',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      asyncValidation: value => fetchSimulate(10).then(() => {
        if (value === 'invalid_value_async') {
          throw new Error('This name is forbidden')
        }
      }),
      expected: {
        errors: { async: 'This name is forbidden' },
        warnings: { 0: 'Warning message' },
        isValid: false,
        eventName: 'onInputBlur',
        touched: true,
        asyncMessage: 'This name is forbidden',
      },
    })
  })

  it('changes state after onChange event is triggered with no validation', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'test_value',
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('changes state after onChange event is triggered with warn', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'test_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { },
        warnings: { 0: 'Warning message' },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('changes state after onChange event is triggered with warn and error', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { 0: 'Error message' },
        warnings: { 0: 'Warning message' },
        isValid: false,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('changes state after onChange event is triggered without warn or error', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'ttt',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('shows no error if the input is disabled at onChange event', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      disabled: true,
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('shows no error if the input is readOnly at onChange event', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      readOnly: true,
      expected: {
        errors: { },
        warnings: { },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('will not async validate if there is sync error onChange', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'invalid_value',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      asyncValidation: value => fetchSimulate(1000).then(() => {
        if (value === 'invalid_value') {
          throw new Error('This name is forbidden')
        }
      }),
      expected: {
        errors: { 0: 'Error message' },
        warnings: { },
        isValid: false,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('will not async validate onChange', async (done) => {
    await checkChange(done, 'handleOnChange', {
      val: 'invalid_value_async',
      validate: [
        value => (value === 'invalid_value' ? 'Error message' : undefined),
      ],
      warn: [
        value => (value.length > 3 ? 'Warning message' : undefined),
      ],
      asyncValidation: value => fetchSimulate(10).then(() => {
        if (value === 'invalid_value_async') {
          throw new Error('This name is forbidden')
        }
      }),
      expected: {
        errors: { },
        warnings: { 0: 'Warning message' },
        isValid: true,
        eventName: 'onInputChange',
        touched: false,
      },
    })
  })

  it('removes async error onChange', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()

    const component = shallow(
      (
        <TestInput
          name="test_input_name"
        />
      ),
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )

    component.setState({ errors: { async: 'some async error' } })
    expect(component.state('errors')).toEqual({ async: 'some async error' })

    const instance = component.instance()
    await instance.handleOnChange('some_value')

    expect(component.state('errors')).toEqual({ })

    done()
  })

  it('returns validation state onFormSubmit event', async (done) => {
    const mockDispatchEvent = jest.fn()
    const listeners = {}
    const listenTo = (eventName, method) => {
      listeners[eventName] = method
    }

    const component = shallow(
      (
        <TestInput
          name="test_input_name"
          validate={[
            value => (value === 'wrong_value' ? 'error' : undefined),
          ]}
        />
      ),
      {
        context: {
          listenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )

    component.setState({ value: 'wrong_value' })
    let result = await listeners.onFormSubmit()
    expect(result).toEqual({
      errors: { 0: 'error' },
      inputName: 'test_input_name',
      value: 'wrong_value',
      warnings: {},
    })

    component.setState({ value: 'test_value' })
    result = await listeners.onFormSubmit()
    expect(result).toEqual({
      errors: {},
      inputName: 'test_input_name',
      value: 'test_value',
      warnings: {},
    })

    done()
  })
})
