import React, { Component } from 'react'
import T from 'prop-types'
import { StrapInput, StrapInputPropTypes, StrapFormContextTypes } from '../../../index'
import { Input, InputGroup, InputGroupAddon, FormText } from 'reactstrap'

class InputPure extends Component {
  static propTypes = {
    ...StrapInputPropTypes,
    helpText: T.string,
    required: T.bool,
  }

  static defaultProps = {
    helpText: '',
    required: false,
  }

  static contextTypes = {
    ...StrapFormContextTypes,
  }

  componentWillMount() {
    // Add internal validation to the component by listening for
    // onBeforeSyncValidation event and pushing new validation methods
    // to the existing lists of validators
    this.context.listenTo('onBeforeSyncValidation', ({ inputName, errorValidators }) => {
      // Make sure event has been dispatched for current component
      // and required property is set to true
      if (inputName !== this.props.input.name || !this.props.required) {
        return
      }

      // Use unshift to make sure that this validation will be checked first
      errorValidators.unshift(value => (value ? undefined : 'This field is required'))
    })
  }

  get color() {
    const { hasErrors, hasWarnings, touched } = this.props

    if ((hasErrors || hasWarnings) && touched) {
      return hasErrors ? 'danger' : 'warning'
    }

    return 'default'
  }

  get formText() {
    const { hasErrors, hasWarnings, helpText, touched } = this.props
    if (((hasErrors || hasWarnings) && touched) || !helpText) {
      return
    }

    return <FormText color="muted">{helpText}</FormText>
  }

  render() {
    const { input, isValidating } = this.props

    return (
      <div>
        <InputGroup>
          <Input
            {...input}
            state={this.color}
            type={'text'}
          />
          {isValidating && <InputGroupAddon>validating...</InputGroupAddon>}
        </InputGroup>
        {this.formText}
      </div>
    )
  }
}

export default StrapInput(InputPure)
