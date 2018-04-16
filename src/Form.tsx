import * as React from "react"
import * as PropTypes from 'prop-types'
import { IValidator, SyncValidator, EResultType, ValidationResult, EValidationType } from './Validators'
import { IValidationManager, ValidationManager } from './ValidationManager'
import { IEventsManager, EventsManager } from './EventsManager'
import { TInputData } from './Input'
import { ReactNode } from "react";
import { IComponentProps } from './common'

export interface IFormProps extends IComponentProps {
  children: any
}

export type TFormRendererProps = {
  children: any
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
  registerInput: (inputName: string, data: TInputData) => void,
  deregisterInput: (inputName: string) => void,
  getValidationManager: () => IValidationManager
  getEventManager: () => IEventsManager
}

export type TInputsData = {
  [key: string]: TInputData
}

export class Form extends React.Component<IFormProps> {
  private _validationManager: ValidationManager
  private eventsManager: EventsManager
  private inputsData: TInputsData = {}
  private _options: TFormOptions = {
    isPristine: true,
    isSubmitted: false,
    isTouched: false,
    isValid: false,
  }

  private _rendererProps: TFormRendererProps = {
    children: this.props.children,
    className: this.props.className,
    handleFormSubmit: this.handleFormSubmit,
  }

  static defaultProps: IFormProps = {
    children: {},
    name: '',
  }

  static childContextTypes = {
    strapActions: PropTypes.object,
  }

  constructor(args: any) {
    super(args)
    this.eventsManager = new EventsManager()
    this._validationManager = new ValidationManager({
      eventsManager: this.eventsManager
    })
  }

  componentDidMount() {
    // console.log(this._validationManager)
  }

  public getChildContext() {
    const context: TFormChildContextTypes = {
      registerInput: this.registerInput,
      deregisterInput: this.deregisterInput,
      getValidationManager: () => {
        return this._validationManager
      },
      getEventManager: () => {
        return this.eventsManager
      }
    }

    return {
      strapActions: context,
    }
  }

  private registerInput(inputName: string, data: TInputData) {
    if (!this.inputsData) this.inputsData = {}
    this.inputsData[inputName] = data
  }

  private deregisterInput(inputName: string) {
    delete this.inputsData[inputName]
    if (this._validationManager) {
      this._validationManager.removeValidator(inputName)
    }
  }

  private async handleFormSubmit(): Promise<any> {

  }

  private defaultRenderer(props: TFormRendererProps): ReactNode {
    return (
      <form className={props.className} onSubmit={props.handleFormSubmit}>
        {props.children}
      </form>
    )
  }

  public render(): ReactNode {
    const { componentRenderer, children } = this.props
    const renderMethod = !!componentRenderer ? componentRenderer : this.defaultRenderer

    return renderMethod(this._rendererProps)
  }
}
