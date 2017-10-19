/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import StrapGroup from '../StrapGroup'

// eslint-disable-next-line
const GroupPure = (props) => (
  <div>{JSON.stringify(props)}</div>
)

const Group = StrapGroup(GroupPure)

configure({ adapter: new Adapter() })

describe('StrapGroup', () => {
  it('handle OnInputChange successfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    await instance.handleOnInputChange({
      inputName: 'testInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({ testInput: 'some errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'some warnings' })
    expect(component.state('values')).toEqual({ testInput: 'test value' })
    expect(instance.isPristine).toBe(false)
    expect(instance.touched).toBe(false)

    done()
  })

  it('handle OnInputChange unsuccessfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    await instance.handleOnInputChange({
      inputName: 'wrongInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(false)

    done()
  })

  it('handle OnInputBlur successfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    await instance.handleOnInputBlur({
      inputName: 'testInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({ testInput: 'some errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'some warnings' })
    expect(component.state('values')).toEqual({ testInput: 'test value' })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(true)

    done()
  })

  it('handle OnInputBlur unsuccessfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    await instance.handleOnInputBlur({
      inputName: 'wrongInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(false)

    done()
  })

  it('handle handleOnFormUpdate when submitting', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })

    await instance.handleOnFormUpdate({
      values: { testInput: 'submit values', wrongInput: 'wrong' },
      errors: { testInput: 'submit errors', wrongInput: 'wrong' },
      warnings: { testInput: 'submit warnings', wrongInput: 'wrong' },
      isSubmitting: true,
    })

    expect(component.state('errors')).toEqual({ testInput: 'submit errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'submit warnings' })
    expect(component.state('values')).toEqual({ testInput: 'submit values' })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(true)

    done()
  })

  it('handle handleOnFormUpdate not submitting', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })

    await instance.handleOnFormUpdate({
      values: { testInput: 'submit values' },
      errors: { testInput: 'submit errors' },
      warnings: { testInput: 'submit warnings' },
      isSubmitting: false,
    })

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(false)

    done()
  })

  it('handle registerToGroup correct', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = []

    expect(instance.inputNames).toEqual([])

    instance.handleRegisterToGroup('someInput')
    instance.handleRegisterToGroup('someInput')
    instance.handleRegisterToGroup('anotherInput')

    expect(instance.inputNames).toEqual(['someInput', 'anotherInput'])

    done()
  })

  it('handle deregisterFromGroup correct', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['firstInput', 'secondInput', 'thirdInput']

    expect(instance.inputNames).toEqual(['firstInput', 'secondInput', 'thirdInput'])

    instance.handleDeregisterFromGroup('secondInput')
    instance.handleDeregisterFromGroup('secondInput')

    expect(instance.inputNames).toEqual(['firstInput', 'thirdInput'])

    done()
  })

  it('handle handleOnAfterSyncValidation successfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    instance.handleOnAfterSyncValidation({
      inputName: 'testInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({ testInput: 'some errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'some warnings' })
    expect(component.state('values')).toEqual({ testInput: 'test value' })
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(false)

    done()
  })

  it('handle handleOnAfterSyncValidation unsuccessfull', async (done) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <Group />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    instance.inputNames = ['testInput']

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(component.state('values')).toEqual({ })

    instance.handleOnAfterSyncValidation({
      inputName: 'wrongInput',
      errors: 'some errors',
      warnings: 'some warnings',
      value: 'test value',
    })

    expect(component.state('errors')).toEqual({})
    expect(component.state('warnings')).toEqual({})
    expect(component.state('values')).toEqual({})
    expect(instance.isPristine).toBe(true)
    expect(instance.touched).toBe(false)

    done()
  })
})
