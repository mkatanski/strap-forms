import * as React from "react"
import * as PropTypes from 'prop-types'
import { ReactNode } from "react";

import { IInputProps, TEventCallback, TInputRendererProps, TInputState} from './Input.types'

import { FormContextConsumer } from './Form/Form'

export class InputPure extends React.Component<IInputProps> {
  static defaultProps: IInputProps = {
    name: '',
    value: '',
    registerInput: (inputName: string, inputState: TInputState, onEvent: TEventCallback) => { },
  }

  state: TInputState = {
    value: this.props.value,
    isPristine: true,
    isTouched: false,
    isValid: false,
  }

  public componentDidMount() {
    this.props.registerInput(this.props.name, Object.freeze({ ...this.state }), (event: any) => {
      if (event.type === 'onValidateDone') {

      }
    });
  }

  public componentWillUnmount() {
    // deregister component
  }

  public componentWillReceiveProps(nextProps: IInputProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
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
    // const { validateSync, validateAsync } = this.props;
    const value = e.target ? e.target.value : e
    this.setState({ value, isTouched: true }, async () => {
      // validate sync and async current component
      // const syncResult = await validateSync(this.props.name, { ... this.state });
      // if (syncResult.errors) {
      //   return;
      // }

      // const asyncResult = await validateAsync(this.props.name, { ... this.state });
    })
  }

  private handleInputChange(e: any): void {
    const value = e.target ? e.target.value : e
    this.setState({ value, isPristine: false }, () => {
      // validate sync only for current component
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
      />
    }
  </FormContextConsumer>
)
