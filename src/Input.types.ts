import { IComponentProps } from './common'
import { ReactNode } from "react";

export type TEventCallback = (event: any) => void

export interface IInputProps extends IComponentProps {
  registerInput: (inputName: string, inputState: TInputState, onEvent: TEventCallback) => void,
  value?: any
  render?: (props: TInputRendererProps) => ReactNode
  onBlurValidation?: any,
  onChangeValidation?: any,
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
