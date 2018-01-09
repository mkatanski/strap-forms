import React, { Component } from 'react'
import T from 'prop-types'

import { StrapFormContextTypes } from './StrapForm'
import { isValid } from './utils/helpers'

export const StrapGroupPropTypes = {
  hasErrors: T.bool,
  hasWarnings: T.bool,
  errors: T.object,
  warnings: T.object,
  isPristine: T.bool,
}

export const StrapGroupContextTypes = {
  registerToGroup: T.func,
  deregisterFromGroup: T.func,
}

export default function (Group) {
  class StrapGroup extends Component {
    static contextTypes = {
      ...StrapFormContextTypes,
    }
    static childContextTypes = {
      ...StrapGroupContextTypes,
    }

    static propTypes = {
      children: T.any.isRequired,
    }

    static defaultProps = {
    }

    constructor(...args) {
      super(...args)

      this.inputNames = []
      this.isPristine = true
      this.touched = false
    }

    state = {
      errors: {},
      warnings: {},
      values: {},
    }

    getChildContext() {
      return {
        registerToGroup: this.handleRegisterToGroup,
        deregisterFromGroup: this.handleDeregisterFromGroup,
      }
    }

    componentWillMount() {
      this.context.listenTo('onInputChange', this.handleOnInputChange)
      this.context.listenTo('onInputBlur', this.handleOnInputBlur)
      this.context.listenTo('onFormUpdate', this.handleOnFormUpdate)
      this.context.listenTo('onAfterSyncValidation', this.handleOnAfterSyncValidation)
    }

    setValidationResult = (e) => {
      const { errors, warnings, values } = this.state
      errors[e.inputName] = e.errors
      warnings[e.inputName] = e.warnings
      values[e.inputName] = e.value

      this.setState({
        errors,
        warnings,
        values,
      })
    }

    filterData = (list) => {
      const data = {}
      Object.keys(list).forEach((key) => {
        if (!this.inputNames.includes(key)) {
          return
        }
        data[key] = list[key]
      })
      return data
    }

    handleRegisterToGroup = (inputName) => {
      if (this.inputNames.includes(inputName)) {
        return false
      }

      this.inputNames.push(inputName)

      return true
    }

    handleDeregisterFromGroup = (inputName) => {
      const i = this.inputNames.indexOf(inputName)

      if (i === -1) {
        return false
      }

      this.inputNames.splice(i, 1)

      return true
    }

    handleOnFormUpdate = ({ values, errors, warnings, isSubmitting }) => {
      if (!isSubmitting) {
        return
      }

      const groupErrors = this.filterData(errors)
      this.touched = true

      this.setState({
        errors: groupErrors,
        warnings: this.filterData(warnings),
        values: this.filterData(values),
      })
    }

    handleOnAfterSyncValidation = (e) => {
      if (!this.inputNames.includes(e.inputName)) {
        return
      }

      this.setValidationResult(e)
    }

    handleOnInputChange = (e) => {
      if (!this.inputNames.includes(e.inputName)) {
        return
      }

      this.isPristine = false
      this.setValidationResult(e)
    }

    handleOnInputBlur = (e) => {
      if (!this.inputNames.includes(e.inputName)) {
        return
      }

      this.touched = true
      this.setValidationResult(e)
    }

    render() {
      const { errors, warnings, values } = this.state
      const props = {
        hasErrors: errors && !isValid(errors),
        hasWarnings: warnings && !isValid(warnings),
        errors,
        warnings,
        values,
        isPristine: this.isPristine,
        touched: this.touched,
      }

      return (
        <Group {...props}>
          {this.props.children}
        </Group>
      )
    }
  }

  return StrapGroup
}
