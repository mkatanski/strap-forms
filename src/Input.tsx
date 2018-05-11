import * as React from "react"
import * as PropTypes from 'prop-types'
import { ReactNode } from "react";

import { IComponentProps } from './common'
import { Consumer } from './Form'

export interface IInputProps extends IComponentProps {
  registerInput: (inputName: string, inputState: TInputState) => {}
  value?: any
  componentRenderer?: (props: TInputRendererProps) => ReactNode
}

export type TInputState = {
  value: any
  isPristine: boolean
  isTouched: boolean
  isValid: boolean
}

export type TInputRendererProps = {
  className: string,
  onChange: (e: any) => void,
  onBlur: (e: any) => void,
  value: any,
  name: string,
}

export class InputPure extends React.Component<IInputProps> {
  static defaultProps: IInputProps = {
    name: '',
    value: '',
    registerInput: (inputName: string, inputState: TInputState) => { return null }
  }

  static contextTypes = {
    strapActions: PropTypes.object
  }

  state: TInputState = {
    value: this.props.value,
    isPristine: true,
    isTouched: false,
    isValid: false,
  }

  public componentDidMount() {
    this.props.registerInput(this.props.name, { ...this.state })
  }

  public componentWillUnmount() {

  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  private get _rendererProps(): TInputRendererProps {
    return {
      className: this.props.className,
      onChange: this.handleInputChange,
      onBlur: this.handleInputBlur,
      value: this.state && this.state.value,
      name: this.props.name,
    }
  }

  private handleInputBlur(e: any): void {
    const value = e.target ? e.target.value : e
    this.setState({ value, isTouched: true }, () => {
      // validate sync and async current component
    })
  }

  private handleInputChange(e: any): void {
    const value = e.target ? e.target.value : e
    this.setState({ value, isPristine: false }, () => {
      // validate sync only for current component
    })
  }

  private defaultRenderer(props: TInputRendererProps): ReactNode {
    return (
      <input
        className={props.className}
        onChange={props.onChange.bind(this)}
        onBlur={props.onBlur.bind(this)}
        value={props.value}
        name={props.name}
      />
    )
  }

  public render(): ReactNode {
    const { componentRenderer, children } = this.props
    return !!componentRenderer ?
      componentRenderer(this._rendererProps) :
      this.defaultRenderer(this._rendererProps)
  }
}

export const Input = (props: any) => (
  <Consumer>
    {context =>
      <InputPure
        {...props}
        registerInput={context.registerInput}
      />
    }
  </Consumer>
)
