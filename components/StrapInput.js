import React, { Component } from 'react'
import T from 'prop-types'

import { StrapFormContextTypes } from './StrapForm'
import { StrapGroupContextTypes } from './StrapGroup'

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

export default function (Input) {
  class StrapInput extends Component {
    static contextTypes = {
      ...StrapFormContextTypes,
      ...StrapGroupContextTypes,
    }

    static propTypes = {
      name: T.string.isRequired,
      asyncValidation: T.func,
      children: T.any,
      disabled: T.bool,
      initialValue: T.any,
      readOnly: T.bool,
      validate: T.array,
      warn: T.array,
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

    constructor(...args) {
      super(...args)

      this.asyncQueue = []
    }

    state = {
      touched: false,
      isValidating: false,
      errors: {},
      warnings: {},
      value: this.props.initialValue || '',
    }

    componentWillMount() {
      this.context.listenTo('onFormSyncValidate', this.handleOnFormSyncValidate)
      this.context.listenTo('onFormAsyncValidate', this.handleOnFormAsyncValidate)
      if (this.context.registerToGroup) {
        this.context.registerToGroup(this.props.name)
      }
    }

    componentWillUnmount() {
      if (this.context.deregisterFromGroup) {
        this.context.deregisterFromGroup(this.props.name)
      }
    }

    getValidationResult = validationResult => ({
      inputName: this.props.name,
      value: this.state.value,
      ...validationResult,
    })

    isValid = errors => Object.keys(errors).length === 0

    dispatchEvent = (eventName, data) => {
      const enhancedData = {
        inputName: this.props.name,
        ...data,
      }

      return this.context.dispatchEvent(eventName, enhancedData)
    }

    performAsyncValidation = async (value) => {
      const asyncValidateMethod = this.props.asyncValidation
      let message

      if (!asyncValidateMethod || this.props.disabled || this.props.readOnly) {
        return message
      }

      this.setState({ isValidating: true })
      this.asyncQueue.push(value)
      this.dispatchEvent('onBeforeAsyncValidation', {
        value,
        asyncQueue: [...this.asyncQueue],
      })

      try {
        await asyncValidateMethod(value, this.state.values)
      } catch (error) {
        message = error.message
      }

      const queueIndex = this.asyncQueue.indexOf(value)
      this.asyncQueue.splice(queueIndex, 1)

      this.dispatchEvent('onAfterAsyncValidation', {
        message,
        asyncQueue: [...this.asyncQueue],
      })

      this.setState({ isValidating: false })
      return message
    }

    performSyncValidation = (value) => {
      const errorValidators = [...this.props.validate]
      const warnValidators = [...this.props.warn]
      const { errors, warnings } = this.state

      if (this.props.disabled || this.props.readOnly) {
        return { errors, warnings }
      }

      this.dispatchEvent('onBeforeSyncValidation', {
        errors: [...errors],
        warnings: [...warnings],
        value,
        errorValidators,
        warnValidators,
      })

      this.validate({ validators: errorValidators, errors, value })
      this.validate({ validators: warnValidators, errors: warnings, value })

      this.dispatchEvent('onAfterSyncValidation', { errors, warnings, value })
      return { errors, warnings }
    }

    performFullValidation = async (value) => {
      let asyncError
      const validationResult = this.performSyncValidation(value)

      if (this.isValid(validationResult.errors)) {
        asyncError = await this.performAsyncValidation(value)
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
      this.setState({ touched: true, value })

      const validationResult = await this.performFullValidation(value)
      const isValid = this.isValid(validationResult.errors)

      this.dispatchEvent('onInputBlur', { value, isValid, ...validationResult })
      this.setState({ ...validationResult })
    }

    handleOnFormAsyncValidate = async () => {
      const asyncError = await this.performAsyncValidation(this.state.value)
      const validationResult = { errors: {}, warnings: {} }

      if (asyncError) {
        validationResult.errors.async = asyncError
      }

      this.setState({ ...validationResult, touched: true })
      return this.getValidationResult(validationResult)
    }

    handleOnFormSyncValidate = () => {
      const validationResult = this.performSyncValidation(this.state.value)
      this.setState({ ...validationResult, touched: true })
      return this.getValidationResult(validationResult)
    }

    filterProps = () => {
      const externalProps = {}
      const propTypesKeys = Object.keys(this.constructor.propTypes)
      Object.keys(this.props).forEach((key) => {
        if (propTypesKeys.includes(key)) {
          return
        }
        externalProps[key] = this.props[key]
      })
      return externalProps
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
        touched: this.state.touched,
        isValidating: this.asyncQueue.length > 0,
      }

      return (
        <Input {...this.filterProps()} {...props}>
          {this.props.children}
        </Input>
      )
    }
  }

  return StrapInput
}
