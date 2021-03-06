/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import StrapForm from '../StrapForm'

// eslint-disable-next-line
const FormPure = ({ children, handleSubmit }) => (
  <form onSubmit={handleSubmit} >{children}</form>
)

const Form = StrapForm(FormPure)

configure({ adapter: new Adapter() })

describe('StrapForm', () => {
  it('handle before and after async validation correctly', () => {
    const component = shallow(<Form />)
    const instance = component.instance()

    expect(instance.validating).toEqual([])
    instance.handleOnBeforeAsyncValidation({ inputName: 'testInput' })
    expect(instance.validating).toEqual(['testInput'])

    instance.handleOnAfterAsyncValidation({ inputName: 'testInput' })
    expect(instance.validating).toEqual([])
  })

  const checkInputEvent = (options) => {
    const { eventName, errors, warnings, isPristine, isValid, mockName } = options
    const mocks = {
      onInputBlur: jest.fn(),
      onInputChange: jest.fn(),
    }
    const component = shallow(
      <Form onInputBlur={mocks.onInputBlur} onInputChange={mocks.onInputChange} />
    )
    const instance = component.instance()
    instance.dispatchEvent = jest.fn()

    expect(instance.isPristine).toBe(true)
    expect(instance.validating).toEqual([])
    expect(instance.errors).toEqual({})
    expect(instance.warnings).toEqual({})
    expect(instance.values).toEqual({})

    instance[eventName]({
      inputName: 'testInput',
      value: 'test_value',
      errors,
      warnings,
    })

    expect(instance.dispatchEvent.mock.calls.length).toBe(1)
    expect(instance.dispatchEvent.mock.calls[0][0]).toBe('onFormUpdate')

    expect(instance.isPristine).toBe(isPristine)
    expect(instance.validating).toEqual([])
    expect(instance.errors).toEqual({ testInput: errors })
    expect(instance.warnings).toEqual({ testInput: warnings })
    expect(instance.values).toEqual({ testInput: 'test_value' })

    const offMock = mockName === 'onInputBlur' ? 'onInputChange' : 'onInputBlur'

    expect(mocks[mockName].mock.calls.length).toBe(1)
    expect(mocks[offMock].mock.calls.length).toBe(0)

    const expectedFormData = {
      errors: { testInput: errors },
      warnings: { testInput: warnings },
      inputName: 'testInput',
      value: 'test_value',
      isValid,
      isPristine,
      isSubmitting: false,
      isValidating: false,
      values: {
        testInput: 'test_value',
      },
    }

    expect(mocks[mockName].mock.calls[0][0]).toEqual(expectedFormData)
    expect(instance.dispatchEvent.mock.calls[0][1]).toEqual({
      errors: { testInput: errors },
      warnings: { testInput: warnings },
      isValid,
      isPristine,
      isSubmitting: false,
      isValidating: false,
      values: {
        testInput: 'test_value',
      },
    })
  }

  it('handle inputBlur event correctly with errors', () => {
    checkInputEvent({
      eventName: 'handleOnInputBlur',
      errors: ['error1', 'error2'],
      warnings: ['warn1'],
      isPristine: false,
      isValid: false,
      mockName: 'onInputBlur',
    })
  })

  it('handle inputBlur event correctly without errors', () => {
    checkInputEvent({
      eventName: 'handleOnInputBlur',
      errors: [],
      warnings: ['warn1'],
      isPristine: false,
      isValid: true,
      mockName: 'onInputBlur',
    })
  })

  it('handle inputChange event correctly with errors', () => {
    checkInputEvent({
      eventName: 'handleOnInputChange',
      errors: ['error1', 'error2'],
      warnings: ['warn1'],
      isPristine: true,
      isValid: false,
      mockName: 'onInputChange',
    })
  })

  it('handle inputChange event correctly without errors', () => {
    checkInputEvent({
      eventName: 'handleOnInputChange',
      errors: [],
      warnings: ['warn1'],
      isPristine: true,
      isValid: true,
      mockName: 'onInputChange',
    })
  })

  it('handle submit with error', async (done) => {
    const preventDefaultMock = jest.fn()
    const onSubmitMock = jest.fn()
    const component = shallow(<Form onSubmit={onSubmitMock} />)
    const instance = component.instance()
    const validationResult = {
      inputName: 'test_input',
      errors: { 0: 'some error' },
      warnings: { 0: 'some warning' },
      value: 'invalid_value',
    }

    instance.dispatchEvent = jest.fn()
    instance.dispatchEvent.mockReturnValue([validationResult])

    expect(instance.submitted).toBe(false)
    await instance.handleSubmit({ preventDefault: preventDefaultMock })

    expect(instance.dispatchEvent.mock.calls.length).toBe(5)
    expect(instance.dispatchEvent.mock.calls[0][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[1][0]).toBe('onFormSyncValidate')
    expect(instance.dispatchEvent.mock.calls[2][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[3][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[4][0]).toBe('onFormSubmitFail')
    expect(onSubmitMock.mock.calls.length).toBe(0)
    expect(instance.submitted).toBe(true)
    expect(instance.isSubmitting).toBe(false)

    done()
  })

  it('handle submit without error', async (done) => {
    const preventDefaultMock = jest.fn()
    const onSubmitMock = jest.fn()
    const component = shallow(<Form onSubmit={onSubmitMock} />)
    const instance = component.instance()
    const validationResult = {
      inputName: 'test_input',
      errors: {},
      warnings: { 0: 'some warning' },
      value: 'invalid_value',
    }

    instance.dispatchEvent = jest.fn()
    instance.dispatchEvent.mockReturnValue([validationResult])

    expect(instance.submitted).toBe(false)
    await instance.handleSubmit({ preventDefault: preventDefaultMock })

    expect(instance.dispatchEvent.mock.calls.length).toBe(7)
    expect(instance.dispatchEvent.mock.calls[0][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[1][0]).toBe('onFormSyncValidate')
    expect(instance.dispatchEvent.mock.calls[2][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[3][0]).toBe('onFormAsyncValidate')
    expect(instance.dispatchEvent.mock.calls[4][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[5][0]).toBe('onFormSubmit')
    expect(instance.dispatchEvent.mock.calls[6][0]).toBe('onFormUpdate')
    expect(instance.dispatchEvent.mock.calls[5][1]).toEqual({
      errors: {
        test_input: {},
      },
      isPristine: true,
      isSubmitting: true,
      isValid: true,
      isValidating: false,
      values: {
        test_input: 'invalid_value',
      },
      warnings: {
        test_input: { 0: 'some warning' },
      },
    })
    expect(onSubmitMock.mock.calls.length).toBe(1)
    expect(onSubmitMock.mock.calls[0][0]).toEqual({
      errors: { test_input: {} },
      isPristine: true,
      isSubmitting: true,
      isValid: true,
      isValidating: false,
      values: { test_input: 'invalid_value' },
      warnings: { test_input: { 0: 'some warning' } },
    })
    expect(instance.submitted).toBe(true)
    expect(instance.isSubmitting).toBe(false)

    done()
  })

  it('dispatches new event', () => {
    const component = shallow(<Form />)
    const instance = component.instance()

    const mockEventFunc = jest.fn()
    mockEventFunc.mockReturnValue('testResult')

    instance.listeners = {
      testEvent: [mockEventFunc, mockEventFunc],
    }

    const result = instance.dispatchEvent('testEvent', { test: 'data' })

    expect(mockEventFunc.mock.calls.length).toBe(2)
    expect(mockEventFunc.mock.calls[0][0]).toEqual({ test: 'data' })
    expect(mockEventFunc.mock.calls[1][0]).toEqual({ test: 'data' })
    expect(result).toEqual(['testResult', 'testResult'])
  })

  it('doesnt dispatch new event', () => {
    const component = shallow(<Form />)
    const instance = component.instance()

    const mockEventFunc = jest.fn()
    mockEventFunc.mockReturnValue('testResult')

    instance.listeners = {
      testEvent: [mockEventFunc, mockEventFunc],
    }

    const result = instance.dispatchEvent('wrongEvent', { test: 'data' })

    expect(mockEventFunc.mock.calls.length).toBe(0)
    expect(result).toBe(undefined)
  })

  it('returns empty array on dispatch', () => {
    const component = shallow(<Form />)
    const instance = component.instance()

    const mockEventFunc = jest.fn()

    instance.listeners = {
      testEvent: [mockEventFunc],
    }

    const result = instance.dispatchEvent('testEvent', { test: 'data' })

    expect(mockEventFunc.mock.calls.length).toBe(1)
    expect(result).toEqual([])
  })
})
