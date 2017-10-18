import React, { Component } from 'react'
import { StrapGroupPropTypes, StrapGroup } from '../../../index'
import { FormGroup, FormFeedback } from 'reactstrap'

class GroupPure extends Component {
  static propTypes = {
    ...StrapGroupPropTypes,
  }

  get feedback() {
    const { errors, warnings, hasErrors, hasWarnings, touched } = this.props

    if ((hasErrors || hasWarnings) && touched) {
      const list = hasErrors ? errors : warnings
      return this.renderFeedback(list)
    }
  }

  get color() {
    const { hasErrors, hasWarnings, touched } = this.props

    if ((hasErrors || hasWarnings) && touched) {
      return hasErrors ? 'danger' : 'warning'
    }

    return 'default'
  }

  /**
   * Render feedback for each input in group
   */
  renderFeedback = err => Object.keys(err).map(input => Object.keys(err[input]).map(error => (
    <FormFeedback key={`feedback-${input}-${error}`}>
      {err[input][error]}
    </FormFeedback>
  )))

  render() {
    return (
      <FormGroup color={this.color}>
        {this.props.children}
        {this.feedback}
      </FormGroup>
    )
  }
}

export default StrapGroup(GroupPure)
