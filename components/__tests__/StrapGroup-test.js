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

    await instance.handleOnInputChange({
      inputName: 'testInput',
      errors: 'some errors',
      warnings: 'some warnings',
    })

    expect(component.state('errors')).toEqual({ testInput: 'some errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'some warnings' })
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

    await instance.handleOnInputChange({
      inputName: 'wrongInput',
      errors: 'some errors',
      warnings: 'some warnings',
    })

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(instance.isPristine).toBe(true)

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

    await instance.handleOnInputBlur({
      inputName: 'testInput',
      errors: 'some errors',
      warnings: 'some warnings',
    })

    expect(component.state('errors')).toEqual({ testInput: 'some errors' })
    expect(component.state('warnings')).toEqual({ testInput: 'some warnings' })
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

    await instance.handleOnInputBlur({
      inputName: 'wrongInput',
      errors: 'some errors',
      warnings: 'some warnings',
    })

    expect(component.state('errors')).toEqual({ })
    expect(component.state('warnings')).toEqual({ })
    expect(instance.isPristine).toBe(true)

    done()
  })
})
