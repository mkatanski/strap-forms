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
    if (data.type === ValidationResultType.Success) {
      this.setState({ isValid: true });
    }

    if (data.type === ValidationResultType.Error) {
      this.setState({ isValid: false });
    }

    if (data.type === ValidationResultType.Warning) {
      this.setState({ isValid: false });
    }
  }

  private get rendererProps(): TInputRendererProps {
    return {
      className: this.props.className,
      onChange: this.handleInputChange,
      onBlur: this.handleInputBlur,
      value: this.state && this.state.value,
      name: this.props.name,
    }
  }

  private handleInputBlur(e: any): void {
    const { onValidate, name } = this.props;
    const value = e.target ? e.target.value : e

    this.setState({ value, isTouched: true }, async () => {
      const { value, isTouched } = this.state;
      onValidate && isTouched && onValidate(name, value);
    })
  }

  private handleInputChange(e: any): void {
    const { onValidate, name, validateUntouched } = this.props;
    const val = e.target ? e.target.value : e

    this.setState({ value: val, isPristine: false }, () => {
      const { value, isTouched } = this.state;
      onValidate && (isTouched || validateUntouched) && onValidate(name, value);
    })
  }

  private defaultRenderer(componentProps: TInputRendererProps): ReactNode {
    return (
      <input
        className={componentProps.className}
        onChange={componentProps.onChange.bind(this)}
        onBlur={componentProps.onBlur.bind(this)}
        value={componentProps.value}
        name={componentProps.name}
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
