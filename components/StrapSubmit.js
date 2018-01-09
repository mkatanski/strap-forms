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
      disabled: this.props.disabled,
    }

    componentWillMount() {
      this.context.listenTo('onFormUpdate', this.handleOnFormUpdate)
    }

    handleOnFormUpdate = ({ isValid, isSubmitting, isPristine, isValidating }) => {
      const { disableOnValidating } = this.props
      const disabled = (
        this.props.disabled ||
        isSubmitting ||
        (isValidating && disableOnValidating) ||
        (!isValid && !isPristine)
      )

      this.setState({ disabled })
    }

    render() {
      const { disabled } = this.state
      const isDisabled = disabled

      return (
        <Button disabled={isDisabled}>
          {this.props.children}
        </Button>
      )
    }
  }

  return StrapSubmit
}
