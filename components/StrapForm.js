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
  onSubmitFail: T.func,
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

    get formData() {
      return {
        errors: this.errors,
        warnings: this.warnings,
        isValid: isValid(this.errors),
        isPristine: this.isPristine,
        isSubmitting: this.isSubmitting,
        isValidating: this.validating.length !== 0,
        values: this.values,
      }
    }

    getValueWithDefault = (value, defaultValue) => (value !== undefined ? value : defaultValue)

    getFormInputData = inputData => ({
      ...this.formData,
      inputName: inputData.inputName,
      value: inputData.value,
    })

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

    updateFormData = (formData) => {
      const fData = { ...formData }
      const inputsData = fData.inputsData

      this.isPristine = this.getValueWithDefault(fData.isPristine, this.isPristine)
      this.isSubmitting = this.getValueWithDefault(fData.isSubmitting, this.isSubmitting)
      this.submitted = this.getValueWithDefault(fData.submitted, this.submitted)

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

      this.dispatchEvent('onFormUpdate', this.formData)
    }

    handleOnBeforeAsyncValidation = (e) => {
      this.validating.push(e.inputName)
      this.dispatchEvent('onFormUpdate', this.formData)
    }

    handleOnAfterAsyncValidation = (e) => {
      const i = this.validating.indexOf(e.inputName)
      this.validating.splice(i, 1)
    }

    handleInput = (method, inputOptions, isPristine) => {
      this.updateFormData({
        isPristine: this.getValueWithDefault(isPristine, this.isPristine),
        inputsData: [inputOptions],
      })
      this.props[method](this.getFormInputData(inputOptions))
    }

    handleOnInputBlur = (inputOptions) => {
      this.handleInput('onInputBlur', inputOptions, false)
    }

    handleOnInputChange = (inputOptions) => {
      this.handleInput('onInputChange', inputOptions)
    }

    handleSubmit = async (event) => {
      event.preventDefault()
      this.updateFormData({ isSubmitting: true, submitted: true })

      // TODO: Add possibility to edit validators during this event
      const syncResult = this.dispatchEvent('onFormSyncValidate')
      this.updateFormData({ inputsData: syncResult })

      if (!isValid(this.errors)) {
        this.updateFormData({ isSubmitting: false })
        this.dispatchEvent('onFormSubmitFail', this.formData)
        if (this.props.onSubmitFail) {
          await this.props.onSubmitFail(this.formData)
        }
        return
      }

      const asyncHandlers = this.dispatchEvent('onFormAsyncValidate')

      let asyncResult = []
      if (asyncHandlers) {
        asyncResult = await Promise.all(asyncHandlers)
      }

      this.updateFormData({ inputsData: asyncResult })

      if (isValid(this.errors)) {
        this.dispatchEvent('onFormSubmit', this.formData)
        await this.props.onSubmit(this.formData)
      } else {
        this.dispatchEvent('onFormSubmitFail', this.formData)
        if (this.props.onSubmitFail) {
          await this.props.onSubmitFail(this.formData)
        }
      }

      this.updateFormData({ isSubmitting: false })
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
