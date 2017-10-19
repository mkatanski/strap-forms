import React from 'react'
import T from 'prop-types'

import { StrapFormContextTypes } from '../../../../index'

class SubmitButton extends React.Component {
  static contextTypes = {
    ...StrapFormContextTypes,
  }

  static propTypes = {
    children: T.any.isRequired,
  }

  state = {
    disabled: false,
  }

  componentDidMount() {
    this.context.listenTo('onFormUpdate', ({ isValid, isSubmitting, isPristine }) => {
      if (isPristine) return
      this.setState({ disabled: !(isValid && !isSubmitting) })
    })
  }

  render() {
    return (
      <button
        type="submit"
        disabled={this.state.disabled}
      >
        {this.props.children}
      </button>
    )
  }
}

export default SubmitButton
