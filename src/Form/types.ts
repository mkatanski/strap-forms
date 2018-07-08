import { ReactNode } from 'react';
import { IComponentProps } from '../common'
import { TInputState } from '../Input'

export interface IFormProps extends IComponentProps {
  children: any,
  componentRenderer?: (props: TFormRendererProps) => ReactNode
}

export type TFormRendererProps = {
  children: ReactNode
  className: string,
  handleFormSubmit: () => {}
}

export type TFormOptions = {
  isPristine: boolean
  isSubmitted: boolean
  isTouched: boolean
  isValid: boolean
}

export type TFormChildContextTypes = {
  registerInput: (inputName: string, data: TInputState) => void,
  deregisterInput: (inputName: string) => void,
}

export type TInputsData = {
  [key: string]: TInputState
}
