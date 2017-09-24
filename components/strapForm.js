import React, { Component } from 'react'
import T from 'prop-types'

export const StrapFormContextTypes = {
  listenTo: T.func,
  dispatchEvent: T.func,
}

export default function(Form) {
  class StrapForm extends Component {

    static propTypes = {
      children: T.any,
      onInputChange: T.func,
      onInputBlur: T.func,
      onSubmit: T.func,
    }

    static defaultProps = {
      children: null,
      onInputChange: () => { },
      onInputBlur: () => { },
      onSubmit: () => { },
    }

    static childContextTypes = {
      ...StrapFormContextTypes,
    }

    constructor() {
      super(...arguments)

      this.listeners = {}
      this.isSubmitting = false
      this.submitted = false
      this.isPristine = true
      this.values = {}
      this.errors = {}
      this.warnings = {}
      this.validating = []
    }

    getChildContext() {
      return {
        listenTo: this.listenTo,
        dispatchEvent: this.dispatchEvent,
      }
    }

    componentDidMount() {
      this.listenTo('onInputChange', this.handleOnInputChange)
      this.listenTo('onInputBlur', this.handleOnInputBlur)
      this.listenTo('onBeforeAsyncValidation', this.handleOnBeforeAsyncValidation)
      this.listenTo('onAfterAsyncValidation', this.handleOnAfterAsyncValidation)
    }

    get isValid() {
      if (Object.keys(this.errors).length === 0) {
        return true
      }

      let _isValid = true
      Object.keys(this.errors).forEach((errKey) => {
        if (Object.keys(this.errors[errKey]).length !== 0) {
          _isValid = false
        }
      })

      return _isValid
    }

    isArray = (o) => Object.prototype.toString.call(o) !== '[object Array]'

    dispatchEvent = (eventName, eventData) => {
      const listenersResults = []

      if (this.isArray(this.listeners[eventName])) {
        return undefined
      }

      this.listeners[eventName].forEach((listener) => {
        const result = listener(eventData)
        if (result !== undefined) {
          listenersResults.push(result)
        }
      })

      return listenersResults
    }

    listenTo = (eventName, func) => {
      if (this.isArray(this.listeners[eventName])) {
        this.listeners[eventName] = []
      }

      this.listeners[eventName].push(func)
    }

    handleOnBeforeAsyncValidation = (e) => {
      this.validating.push(e.inputName)
    }

    handleOnAfterAsyncValidation = (e) => {
      const i = this.validating.indexOf(e.inputName)
      this.validating.splice(i, 1)
    }

    handleOnInputBlur = ({ value, inputName, errors, warnings }) => {
      this.isPristine = false
      this.errors[inputName] = errors
      this.warnings[inputName] = warnings

      this.values[inputName] = value

      this.props.onInputBlur({
        errors: this.errors,
        warnings: this.warnings,
        inputName,
        value,
        isValid: this.isValid,
        isPristine: this.isPristine,
        isSubmitting: this.isSubmitting,
        isValidating: this.validating.length !== 0,
      })
    }

    handleOnInputChange = ({ value, inputName, errors, warnings }) => {
      this.errors[inputName] = errors
      this.warnings[inputName] = warnings

      this.values[inputName] = value

      this.props.onInputChange({
        errors: this.errors,
        warnings: this.warnings,
        inputName,
        value,
        isValid: this.isValid,
        isPristine: this.isPristine,
        isSubmitting: this.isSubmitting,
        isValidating: this.validating.length !== 0,
      })
    }

    handleSubmit = async (event) => {
      event.preventDefault()
      this.isSubmitting = true
      this.submitted = true
      const validationMethods = this.dispatchEvent('onFormSubmit', {})
      const res = await Promise.all(validationMethods)

      // if any of validation result is
      // false, break form submitting
      if (res.includes(false)) {
        return
      }

      await this.props.onSubmit({
        isPristine: this.isPristine,
        values: this.values,
      })

      this.isSubmitting = false
    }

    render() {
      return (
        <Form handleSubmit={this.handleSubmit}>
          {this.props.children}
        </Form>
      )
    }
  }

  return StrapForm
}
