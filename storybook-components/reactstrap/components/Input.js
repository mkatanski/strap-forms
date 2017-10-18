import React, { Component } from 'react'
import T from 'prop-types'
import { StrapInput, StrapInputPropTypes } from '../../../index'
import { Input, InputGroup, InputGroupAddon, FormText } from 'reactstrap'

class InputPure extends Component {
  static propTypes = {
    ...StrapInputPropTypes,
    helpText: T.string,
  }

  static defaultProps = {
    helpText: '',
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
