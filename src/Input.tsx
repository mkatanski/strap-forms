import * as React from "react"
import * as PropTypes from 'prop-types'
import { ReactNode } from 'react';
import {
  StrapEventType,
  TEventCallback,
  TEventData,
  TValidationResult,
  ValidationResultType
} from './common'

import {
  IInputPureProps,
  TInputRendererProps,
  TInputState,
} from './Input.types'

import { FormContextConsumer } from './Form/Form'

export class InputPure extends React.Component<IInputPureProps> {
  static defaultProps: IInputPureProps = {
    name: '',
    value: '',
    registerInput: (inputName: string, onEvent: TEventCallback) => { },
  }

  state: TInputState = {
    value: this.props.value,
    isPristine: true,
    isTouched: false,
    isValid: false,
    validationMessages: [],
  }

  public componentDidMount() {
    this.props.registerInput(this.props.name, (event: TEventData) => {
      if (event.type === StrapEventType.onValidateDone) {
        this.onValidationComplete(event.data)
      }
    });
  }

  public componentWillUnmount() {
    // deregister component
  }

  public componentWillReceiveProps(nextProps: IInputPureProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  private onValidationComplete(data: TValidationResult) {

    const messages = data.messages || [];

    if (data.type === ValidationResultType.Success) {
      this.setState({ isValid: true, validationMessages: messages });
    }

    if (data.type === ValidationResultType.Error) {
      this.setState({ isValid: false, validationMessages: messages });
    }

    if (data.type === ValidationResultType.Warning) {
      this.setState({ isValid: false, validationMessages: messages });
    }
  }

  private get rendererProps(): TInputRendererProps {
    return {
      name: this.props.name,
      className: this.props.className,
      onChange: this.handleInputChange,
      onBlur: this.handleInputBlur,
      value: this.state && this.state.value,
      isPristine: this.state && this.state.isPristine,
      isTouched: this.state && this.state.isTouched,
      isValid: this.state && this.state.isValid,
      validationMessages: this.state && this.state.validationMessages,
    }
  }

  private runValidation() {
    const { onValidate, name, validateUntouched } = this.props;
    const { value, isTouched } = this.state;
    onValidate && (isTouched || validateUntouched) && onValidate(name, value);
  }

  private handleInputBlur(e: any): void {
    const { onValidate, name } = this.props;
    const value = e.target ? e.target.value : e

    this.setState({ value, isTouched: true }, this.runValidation)
  }

  private handleInputChange(e: any): void {
    const { onValidate, name, validateUntouched } = this.props;
    const value = e.target ? e.target.value : e

    this.setState({ value, isPristine: false }, this.runValidation)
  }

  private defaultRenderer(componentProps: TInputRendererProps): ReactNode {
    return (
      <input
        {...componentProps}
        onChange={componentProps.onChange.bind(this)}
        onBlur={componentProps.onBlur.bind(this)}
      />
    )
  }

  public render(): ReactNode {
    const { render, children } = this.props
    return !!render ?
      render(this.rendererProps) :
      this.defaultRenderer(this.rendererProps)
  }
}

/**
 * Returns Input component with form's context
 * @param props Input properties
 */
export const Input = (props: any) => (
  <FormContextConsumer>
    {context =>
      <InputPure
        {...props}
        registerInput={context.registerInput}
        onValidate={context.validate}
      />
    }
  </FormContextConsumer>
)
