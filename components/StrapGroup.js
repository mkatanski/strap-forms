import React, { Component } from 'react'
import invariant from 'fbjs/lib/invariant'
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

export default function (Group) {
  class StrapGroup extends Component {
    static contextTypes = {
      ...StrapFormContextTypes,
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
    }

    state = {
      errors: {},
      warnings: {},
    }

    componentWillMount() {
      React.Children.map(this.props.children, (child) => {
        invariant(
          child.type.name === 'StrapInput',
          'The group can only contain "StrapInput" components as its children'
        )

        this.inputNames.push(child.props.name)
      })

      this.context.listenTo('onInputChange', this.handleOnInputChange)
      this.context.listenTo('onInputBlur', this.handleOnInputBlur)
    }

    setValidationResult = (e) => {
      const { errors, warnings } = this.state
      errors[e.inputName] = e.errors
      warnings[e.inputName] = e.warnings

      this.setState({
        errors,
        warnings,
      })
    }

    handleOnInputChange = (e) => {
      if (!this.inputNames.includes(e.inputName)) {
        return
      }

      this.setValidationResult(e)
    }

    handleOnInputBlur = (e) => {
      if (!this.inputNames.includes(e.inputName)) {
        return
      }

      this.isPristine = false

      this.setValidationResult(e)
    }

    render() {
      const { errors, warnings } = this.state
      const props = {
        hasErrors: errors && !isValid(errors),
        hasWarnings: warnings && !isValid(warnings),
        errors,
        warnings,
        isPristine: this.isPristine,
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
