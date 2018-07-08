import * as React from 'react'
import * as PropTypes from 'prop-types'
import { TInputState } from '../Input'
import { ReactNode } from 'react';

import {
  IFormProps,
  TFormChildContextTypes,
  TFormOptions,
  TFormRendererProps,
  TInputsData
} from './types'

const { Consumer, Provider } = React.createContext({
  registerInput: (inputName: string, inputState: TInputState) => { },
  eventsObservable: {},
});

export const FormContextConsumer = Consumer

export class Form extends React.Component<IFormProps> {
  private inputsData: TInputsData = {}

  private _options: TFormOptions = {
    isPristine: true,
    isSubmitted: false,
    isTouched: false,
    isValid: false,
  }

  private inputs: {}
  private errors: {}
  private warnings: {}

  private eventsObservable: Object = {}

  private _rendererProps: TFormRendererProps = {
    children: this.props.children,
    className: this.props.className,
    handleFormSubmit: this.handleFormSubmit,
  }

  static defaultProps: IFormProps = {
    children: {},
    name: '',
  }

  // componentDidMount() {
    // console.log(this._validationManager)
  // }

  private registerInput(inputName: string, inputState: TInputState) {
    if (!this.inputsData) this.inputsData = {}
    this.inputsData[inputName] = inputState
  }

  // private deregisterInput(inputName: string) {
    // delete this.inputsData[inputName]
    // if (this._validationManager) {
    //   this._validationManager.removeValidator(inputName)
    // }
  // }

  private async handleFormSubmit(): Promise<any> {

  }

  private defaultRenderer(props: TFormRendererProps): ReactNode {
    return (
      <form
        className={props.className}
        onSubmit={props.handleFormSubmit}
      >
        {props.children}
      </form>
    )
  }

  public render(): ReactNode {
    const { componentRenderer, children } = this.props
    return (
      <Provider value={{
        registerInput: this.registerInput.bind(this),
        eventsObservable: this.eventsObservable,
      }}>
        {!!componentRenderer ?
            componentRenderer(this._rendererProps) :
            this.defaultRenderer(this._rendererProps)}
      </Provider>
    )
  }
}


