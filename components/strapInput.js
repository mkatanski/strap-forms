import React, { Component } from 'react'
import T from 'prop-types'

import { StrapFormContextTypes } from './StrapForm'

export const StrapInputPropTypes = {
  input: T.shape({
    disabled: T.bool,
    id: T.string.isRequired,
    name: T.string.isRequired,
    onBlur: T.func.isRequired,
    onChange: T.func.isRequired,
    readOnly: T.bool,
    value: T.any.isRequired,
  }),
  hasErrors: T.bool,
  hasWarnings: T.bool,
  errors: T.object,
  warnings: T.object,
  touched: T.bool,
  isValidating: T.bool,
}

export default function(Input) {
  class StrapInput extends Component {

    static contextTypes = {
      ...StrapFormContextTypes,
    }

    static propTypes = {
      name: T.string.isRequired,
      asyncValidation: T.func,
      children: T.any,
      disabled: T.bool,
      readOnly: T.bool,
      validate: T.array,
      warn: T.array,
      initialValue: T.any,
    }

    static defaultProps = {
      asyncValidation: null,
      children: null,
      disabled: false,
      readOnly: false,
      validate: [],
      warn: [],
      initialValue: '',
    }

    state = {
      touched: false,
      isValidating: false,
      errors: {},
      warnings: {},
      value: this.props.initialValue || '',
    }

    constructor() {
      super(...arguments)

      this.isValidating = false
    }

    componentWillMount() {
      this.context.listenTo('onFormSubmit', this.handleOnFormSubmit)
    }

    isValid = errors => Object.keys(errors).length === 0

    dispatchEvent = (eventName, data) => {
      const enhancedData = {
        inputName: this.props.name,
        ...data,
      }

      return this.context.dispatchEvent(eventName, enhancedData)
    }

    performAsyncValidation = async (value) => {
      this.dispatchEvent('onBeforeAsyncValidation', { value })
      const asyncValidateMethod = this.props.asyncValidation
      let message = undefined

      if (!asyncValidateMethod || this.props.disabled || this.props.readOnly) {
        return
      }

      try {
        await asyncValidateMethod(value, this.state.values)
      } catch (error) {
        message =  error.message
      }

      this.dispatchEvent('onAfterAsyncValidation', {
        message,
      })

      return message
    }

    performSyncValidation = (value) => {
      const errorValidators = this.props.validate
      const warnValidators = this.props.warn
      const { errors, warnings } = this.state

      if (this.props.disabled || this.props.readOnly) {
        return
      }

      this.validate({
        validators: errorValidators,
        errors,
        value,
      })

      this.validate({
        validators: warnValidators,
        errors: warnings,
        value,
      })

      return { errors, warnings }
    }

    performFullValidation = async (value) => {
      let asyncError = undefined
      const validationResult = this.performSyncValidation(value)

      if (this.isValid(validationResult.errors)) {
        this.setState({ isValidating: true })
        asyncError = await this.performAsyncValidation(value)
        this.setState({ isValidating: false })
      }

      if (asyncError) {
        validationResult.errors.async = asyncError
      }

      return validationResult
    }

    validate = ({ validators, errors, value }) => {
      const inputErrors = errors || {}

      if (!validators) { return }

      validators.forEach((validator, index) => {
        try {
          const result = validator(value, this.state.values)
          if (result) {
            inputErrors[index] = result
          } else if (inputErrors[index]) {
            delete inputErrors[index]
          }
        } catch (e) {
          // catch error
        }
      })
    }

    handleOnChange = (e) => {
      const value = e.target ? e.target.value : e
      const errors = this.state.errors

      if (errors.async) {
        delete errors.async
      }

      this.setState({ value, errors })
      const validationResult = this.performSyncValidation(value)

      this.dispatchEvent('onInputChange', {
        value,
        isValid: this.isValid(validationResult.errors),
        ...validationResult,
      })

      this.setState({ ...validationResult })
    }

    handleOnBlur = async (e) => {
      const value = e.target ? e.target.value : e
      const validationResult = await this.performFullValidation(value)

      this.dispatchEvent('onInputBlur', {
        value,
        isValid: this.isValid(validationResult.errors),
        ...validationResult,
      })

      this.setState({...validationResult, touched: true, value })
    }

    handleOnFormSubmit = async () => {
      const validationResult = await this.performFullValidation(this.state.value)
      this.setState({ ...validationResult, touched: true })
      return this.isValid(validationResult.errors)
    }

    render() {
      const { errors, warnings, value } = this.state
      const props = {
        input: {
          disabled: this.props.disabled,
          id: this.props.name,
          name: this.props.name,
          onBlur: this.handleOnBlur,
          onChange: this.handleOnChange,
          readOnly: this.props.readOnly,
          value,
        },
        hasErrors: errors && !this.isValid(errors),
        hasWarnings: warnings && !this.isValid(warnings),
        errors,
        warnings,
        touched: this.state.touched || this.context.isSubmitting,
        isValidating: this.state.isValidating,
      }

      return (
        <Input {...props}>
          {this.props.children}
        </Input>
      )
    }
  }

  return StrapInput
}
