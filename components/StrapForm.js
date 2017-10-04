import React, { Component } from 'react'
import T from 'prop-types'

import { isValid, isArray } from './utils/helpers'

export const StrapFormContextTypes = {
  listenTo: T.func,
  dispatchEvent: T.func,
}

export const StrapFormPropTypes = {
  onInputBlur: T.func,
  onInputChange: T.func,
  onSubmit: T.func,
}

export default function (Form) {
  class StrapForm extends Component {
    static propTypes = {
      ...StrapFormPropTypes,
      children: T.any,
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

    constructor(...args) {
      super(...args)

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

    dispatchEvent = (eventName, eventData) => {
      const listenersResults = []

      if (!isArray(this.listeners[eventName])) {
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
      if (!isArray(this.listeners[eventName])) {
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

    updateForm = (inputsData) => {
      if (isArray(inputsData) && inputsData.length !== 0) {
        inputsData.forEach((data) => {
          try {
            const { value, inputName, errors, warnings } = data
            this.errors[inputName] = errors
            this.warnings[inputName] = warnings
            this.values[inputName] = value
          } catch (e) {
            // handle error
          }
        })
      }

      const formData = {
        errors: this.errors,
        warnings: this.warnings,
        isValid: isValid(this.errors),
        isPristine: this.isPristine,
        isSubmitting: this.isSubmitting,
        isValidating: this.validating.length !== 0,
      }

      this.dispatchEvent('onFormUpdate', formData)

      return formData
    }

    handleOnInputBlur = (inputOptions) => {
      this.isPristine = false
      const formData = {
        ...this.updateForm([inputOptions]),
        inputName: inputOptions.inputName,
        value: inputOptions.value,
      }
      this.props.onInputBlur(formData)
    }

    handleOnInputChange = (inputOptions) => {
      const formData = {
        ...this.updateForm([inputOptions]),
        inputName: inputOptions.inputName,
        value: inputOptions.value,
      }
      this.props.onInputChange(formData)
    }

    handleSubmit = async (event) => {
      event.preventDefault()
      this.isSubmitting = true
      this.submitted = true
      this.updateForm()

      const onSubmitHandlers = this.dispatchEvent('onFormSubmit', {
        isPristine: this.isPristine,
        errors: this.errors,
        warnings: this.warnings,
        values: this.values,
      })

      let res = []
      if (onSubmitHandlers) {
        res = await Promise.all(onSubmitHandlers)
      }

      this.updateForm(res)

      if (isValid(this.errors)) {
        await this.props.onSubmit({
          isPristine: this.isPristine,
          values: this.values,
        })
      }

      this.isSubmitting = false
      this.updateForm()
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
