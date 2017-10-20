/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React, { Component } from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import StrapSubmit from '../StrapSubmit'

configure({ adapter: new Adapter() })

class PureSubmit extends Component {
  render() {
    // eslint-disable-next-line
    const { disabled } = this.props
    return <button disabled={disabled} type="submit">Test Button</button>
  }
}

const TestSubmit = StrapSubmit(PureSubmit)

describe('StrapSubmit', () => {
  const getComponent = (props) => {
    const mockListenTo = jest.fn()
    const mockDispatchEvent = jest.fn()
    const component = shallow(
      <TestSubmit {...props} />,
      {
        context: {
          listenTo: mockListenTo,
          dispatchEvent: mockDispatchEvent,
        },
      }
    )
    const instance = component.instance()

    return { instance, component, mockListenTo, mockDispatchEvent }
  }

  it('get default values', async (done) => {
    let { component } = getComponent()
    expect(component.state('disabled')).toBe(false)

    component = getComponent({ disabled: true }).component
    expect(component.state('disabled')).toBe(true)

    done()
  })

  it('should be disabled on submitting', async (done) => {
    const { component, instance } = getComponent()

    instance.handleOnFormUpdate({ isSubmitting: true, isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(true)
    done()
  })

  it('should be disabled on validating', async (done) => {
    const { component, instance } = getComponent()

    instance.handleOnFormUpdate({ isValidating: true, isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(true)
    done()
  })

  it('should not be disabled on validating if disableOnValidating is false', async (done) => {
    const { component, instance } = getComponent({
      disableOnValidating: false,
    })

    instance.handleOnFormUpdate({ isValidating: true, isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(false)
    done()
  })

  it('should be disabled on validating if form is invalid', async (done) => {
    const { component, instance } = getComponent({
      disableOnValidating: false,
    })

    instance.handleOnFormUpdate({ isValidating: true, isValid: false, isPristine: false })

    expect(component.state('disabled')).toBe(true)
    done()
  })

  it('should not be disabled on validating if disableOnValidating is false and form is invalid but pristine', async (done) => {
    const { component, instance } = getComponent({
      disableOnValidating: false,
    })

    instance.handleOnFormUpdate({ isValidating: true, isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(false)
    done()
  })

  it('should be disabled on validating anyway', async (done) => {
    const { component, instance } = getComponent({
      disableOnValidating: false,
      disabled: true,
    })

    instance.handleOnFormUpdate({ isValidating: true, isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(true)
    done()
  })

  it('should be disabled if form is invalid and form is not pristine', async (done) => {
    const { component, instance } = getComponent()

    instance.handleOnFormUpdate({ isValid: false, isPristine: false })

    expect(component.state('disabled')).toBe(true)
    done()
  })

  it('should not be disabled if form is invalid but form is pristine', async (done) => {
    const { component, instance } = getComponent()

    instance.handleOnFormUpdate({ isValid: false, isPristine: true })

    expect(component.state('disabled')).toBe(false)
    done()
  })
})
