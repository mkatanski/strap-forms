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
      // true if async validation for this input is running
      isValidating: false,
    }

    componentWillMount() {
      this.context.setSyncValidators(this.props.name, this.props.validate)
      this.context.setAsyncValidators(this.props.name, this.props.asyncValidation)
      this.context.setWarnValidators(this.props.name, this.props.warn)

      this.context.setDisabled(this.props.name, this.props.disabled)
      this.context.setReadOnly(this.props.name, this.props.readOnly)

      if (this.props.initialValue) {
        this.context.setValue(this.props.name, this.props.initialValue)
      }
    }

    handleOnChange = (e) => {
      const value = e.target ? e.target.value : e

      this.syncValidate(value)
      this.context.handleOnChange(this.props.name, value)
    }

    handleOnBlur = async (e) => {
      const value = e.target ? e.target.value : e

      if (!this.state.touched) {
        this.setState({ touched: true })
      }

      if (this.syncValidate(value)) {
        await this.asyncValidate(value)
      }
      this.context.handleOnBlur(this.props.name, value)
    }

    syncValidate = value => this.context.syncValidateFor(this.props.name, value)

    asyncValidate = async (value) => {
      this.setState({ isValidating: true })
      await this.context.asyncValidateFor(this.props.name, value)
      this.setState({ isValidating: false })
    }

    render() {
      const errors = this.context.getErrorsFor(this.props.name)
      const warnings = this.context.getWarningsFor(this.props.name)
      const value = this.context.getValueFor(this.props.name)

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
        hasErrors: errors && Object.keys(errors).length !== 0,
        hasWarnings: warnings && Object.keys(warnings).length !== 0,
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
