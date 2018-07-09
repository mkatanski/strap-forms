import { IComponentProps, StrapEventType, TEventCallback } from './common'
import { ReactNode } from "react";

export interface IInputPureProps extends IComponentProps {
  registerInput: (inputName: string, onEvent: TEventCallback) => void,
  onValidate?: (inputName: string, inputValue: any) => void
  validateUntouched?: boolean
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
  validationMessages: Array<string>
}

export type TInputRendererProps = {
  className: string,
  onChange: (e: any) => void,
  onBlur: (e: any) => void,
  value: any,
  name: string,
  isPristine: boolean,
  isTouched: boolean,
  isValid: boolean,
  validationMessages: Array<string>
}
