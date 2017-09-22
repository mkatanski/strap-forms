import React, { Component } from 'react'
import T from 'prop-types'

export const StrapFormContextTypes = {
  asyncValidateFor: T.func.isRequired,
  getAsyncValidators: T.func.isRequired,
  getErrorsFor: T.func.isRequired,
  getSyncValidators: T.func.isRequired,
  getValueFor: T.func.isRequired,
  getWarnValidators: T.func.isRequired,
  getWarningsFor: T.func.isRequired,
  handleOnBlur: T.func.isRequired,
  handleOnChange: T.func.isRequired,
  setAsyncValidators: T.func.isRequired,
  setDisabled: T.func.isRequired,
  setReadOnly: T.func.isRequired,
  setSyncValidators: T.func.isRequired,
  setWarnValidators: T.func.isRequired,
  setValue: T.func.isRequired,
  syncValidateFor: T.func.isRequired,
  isSubmitting: T.bool,
}

export default function(Form) {
  class StrapForm extends Component {

    static propTypes = {
      children: T.any,
      onFormUpdate: T.func,
      onSubmit: T.func,
      onValuesChange: T.func,
    }

    static defaultProps = {
      children: null,
      onFormUpdate: () => { },
      onSubmit: () => { },
      onValuesChange: () => { },
    }

    static childContextTypes = {
      ...StrapFormContextTypes,
    }

    state = {
      isValid: false,
      isSubmitting: false,
      submitted: false,
      // true if the form is pristine,
      // i.e.the values have NOT been altered
      // from the original initialValues provided.
      isPristine: true,
      // true if any or all of the async validations is running
      isValidating: [],
      errors: {},
      warnings: {},
      values: {},
      syncValidators: {},
      asyncValidators: {},
      warnValidators: {},
      readOnly: {},
      disabled: {},
    }

    getChildContext() {
      return {
        handleOnBlur: this.handleOnBlur,
        handleOnChange: this.handleOnChange,
        setSyncValidators: this.setSyncValidators,
        setWarnValidators: this.setWarnValidators,
        setAsyncValidators: this.setAsyncValidators,
        getSyncValidators: this.getSyncValidators,
        getWarnValidators: this.getWarnValidators,
        getAsyncValidators: this.getAsyncValidators,
        setDisabled: this.setDisabled,
        setReadOnly: this.setReadOnly,
        syncValidateFor: this.syncValidateFor,
        asyncValidateFor: this.asyncValidateFor,
        getErrorsFor: this.getErrorsFor,
        getWarningsFor: this.getWarningsFor,
        isSubmitting: this.state.submitted,
        getValueFor: this.getValueFor,
        setValue: this.setValue,
      }
    }

    componentDidMount() {
      this.dispatchUpdate()
    }

    get isValid() {
      if (Object.keys(this.state.errors).length === 0) {
        return true
      }

      let isValid = true
      Object.keys(this.state.errors).forEach((errKey) => {
        if (Object.keys(this.state.errors[errKey]).length !== 0) {
          isValid = false
        }
      })

      return isValid
    }

    //
    // ─── CONTEXT METHODS ─────────────────────────────────────────────
    //
    // Methods that are passed down via context and are triggered directly
    // from child components

    getErrorsFor = inputName => this.state.errors[inputName]
    getWarningsFor = inputName => this.state.warnings[inputName]
    getValueFor = inputName => this.state.values[inputName] || ''

    getAsyncValidators = (inputName) => this.state.asyncValidators[inputName]
    getSyncValidators = (inputName) => this.state.syncValidators[inputName]
    getWarnValidators = (inputName) => this.state.warnValidators[inputName]

    setDisabled = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'disabled', false)

    setReadOnly = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'readOnly', false)

    setAsyncValidators = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'asyncValidators')

    setSyncValidators = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'syncValidators')

    setWarnValidators = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'warnValidators')

    setValue = (inputName, value) =>
      this.setSomethingFor(inputName, value, 'values')

    syncValidateFor = (inputName, value) => {
      const errorValidators = this.state.syncValidators[inputName]
      const warnValidators = this.state.warnValidators[inputName]
      const { errors, warnings } = this.state

      if (this.state.disabled[inputName] || this.state.readOnly[inputName]) {
        return
      }

      const isValid = this.performSyncValidation({
        validators: errorValidators,
        errors,
        value,
        inputName,
      })

      this.performSyncValidation({
        validators: warnValidators,
        errors: warnings,
        value,
        inputName,
      })

      this.setState({ isValid: this.isValid, errors, warnings })
      this.dispatchUpdate()
      return isValid
    }

    asyncValidateFor = async (inputName, value) => {
      const asyncValidateMethod = this.state.asyncValidators[inputName]
      const { errors } = this.state
      errors[inputName] = {}

      if (!asyncValidateMethod ||
        this.state.disabled[inputName] ||
        this.state.readOnly[inputName]) {
        return
      }

      const { isValidating } = this.state
      isValidating.push(inputName)
      this.setState({ isValidating })
      this.dispatchUpdate()

      try {
        await asyncValidateMethod(value, this.state.values)
      } catch (error) {
        const { message } = error
        errors[inputName].async = message
      }

      isValidating.splice(isValidating.indexOf(inputName), 1)

      this.setState({ isValid: this.isValid, errors, isValidating })
      this.dispatchUpdate()
    }

    handleOnBlur = (inputName, value) => {
      const { values } = this.state
      values[inputName] = value
      this.props.onValuesChange(values)

      if (this.state.isPristine) {
        this.setState({ isPristine: false })
        this.dispatchUpdate({ isPristine: false })
      }

      this.setState({ values })
    }

    handleOnChange = (inputName, value) => {
      const { errors, values } = this.state
      const inputErrors = errors[inputName] || {}

      values[inputName] = value
      this.props.onValuesChange(values)

      if (inputErrors.async) {
        delete inputErrors.async
      }

      this.setState({ errors, values })
    }

    //
    // ─── PRIVATE METHODS ─────────────────────────────────────────────
    //
    // Helpers, etc. for strapForm HoC

    setSomethingFor = (inputName, value, property, omitFalsy = true) => {
      if (!value && omitFalsy) {
        return
      }
      const prop = this.state[property]
      prop[inputName] = value
      this.setState({ [property]: prop })
    }

    dispatchUpdate = (override) => {
      const formState = Object.assign({}, {
        isValid: this.isValid,
        isPristine: this.state.isPristine,
        isSubmitting: this.state.isSubmitting,
        errors: this.state.errors,
        warnings: this.state.warnings,
        isValidating: this.state.isValidating.length > 0,
      }, override)
      this.props.onFormUpdate(formState)
    }

    performSyncValidation = ({ validators, errors, inputName, value }) => {
      const err = errors
      const inputErrors = errors[inputName] || {}
      let isValid = true

      if (!validators) {
        return true
      }

      validators.forEach((validator, index) => {
        try {
          const result = validator(value, this.state.values)
          if (result) {
            inputErrors[index] = result
            isValid = false
          } else if (inputErrors[index]) {
            delete inputErrors[index]
          }
        } catch (e) {
          // catch error
        }
      })

      err[inputName] = inputErrors

      return isValid
    }

    handleSubmit = async (event) => {
      event.preventDefault()
      this.setState({ isSubmitting: true, submitted: true })

      Object.keys(this.state.syncValidators).forEach((inputName) => {
        this.syncValidateFor(inputName, this.state.values[inputName])
      })

      if (!this.isValid) { return }
      const promises = []
      Object.keys(this.state.asyncValidators).forEach((inputName) => {
        promises.push(this.asyncValidateFor(inputName, this.state.values[inputName]))
      })

      await Promise.all(promises)
      if (!this.isValid) { return }

      await this.props.onSubmit({
        isPristine: this.state.isPristine,
        isSubmitting: this.state.isSubmitting,
        errors: this.state.errors,
        warnings: this.state.warnings,
        values: this.state.values,
      })

      this.setState({ isSubmitting: false })
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
