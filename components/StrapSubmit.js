import React, { Component } from 'react'
import T from 'prop-types'

import { StrapFormContextTypes } from './StrapForm'

export const StrapSubmitPropTypes = {
  disabled: T.bool,
}

export default function (Button) {
  class StrapSubmit extends Component {
    static contextTypes = {
      ...StrapFormContextTypes,
    }

    static propTypes = {
      children: T.any.isRequired,
      disabled: T.bool,
      disableOnValidating: T.bool,
    }

    static defaultProps = {
      disabled: false,
      disableOnValidating: true,
    }

    state = {
      disabled: false,
    }

    componentWillMount() {
      const { disableOnValidating } = this.props
      this.context.listenTo('onFormUpdate', ({ isValid, isSubmitting, isPristine, isValidating }) => {
        if (isPristine && !(isValidating && disableOnValidating)) return
        this.setState({ disabled: !(isValid && !isSubmitting && !isValidating) })
      })
    }

    render() {
      const { disabled } = this.state
      const isDisabled = disabled || this.props.disabled

      return (
        <Button disabled={isDisabled}>
          {this.props.children}
        </Button>
      )
    }
  }

  return StrapSubmit
}
