import React, { Component } from 'react'
import { StrapInput, StrapInputPropTypes } from '../../../index'

class InputPure extends Component {
  static propTypes = {
    ...StrapInputPropTypes,
  }

  get errors() {
    const { errors, warnings, touched } = this.props

    return (
      <div>
        <ul className="errors">
          {touched && Object.keys(errors).map(k => <li key={k}>{errors[k]}</li>)}
        </ul>
        <ul className="warnings">
          {touched && Object.keys(warnings).map(k => <li key={k}>{warnings[k]}</li>)}
        </ul>
      </div>
    )
  }

  render() {
    const { input, isValidating } = this.props

    return (
      <div>
        <input {...input} />
        {isValidating && <span>validating...</span>}
        {this.errors}
      </div>
    )
  }
}

export default StrapInput(InputPure)
