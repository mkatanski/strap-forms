import * as React from "react"
import * as PropTypes from 'prop-types'
import { ReactNode } from "react";
import { IComponentProps } from './common'
import { TFormChildContextTypes } from './Form'
import { TSyncValidationMethod, SyncValidator } from './Validators'
import { EventsManager, IEventsManager, EventEmitter } from './EventsManager'

export interface IInputProps extends IComponentProps {
  value?: any
  syncValidations?: Array<TSyncValidationMethod>
}

export type TInputData = {
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

export class Input extends React.Component<IInputProps> {
  static defaultProps: IInputProps = {
    name: '',
    value: '',
    syncValidations: []
  }

  static contextTypes = {
    strapActions: PropTypes.object
  }

  private eventsManager: IEventsManager

  context: {
    strapActions: TFormChildContextTypes
  }

  state: TInputData = {
    value: this.props.value,
    isPristine: true,
    isTouched: false,
    isValid: false,
  }

  public componentDidMount() {
    if (this.context.strapActions) {
      this.context.strapActions.registerInput(this.props.name, this.state)
      this.eventsManager = this.context.strapActions.getEventManager()

      // Prepare and add all sync validation methods
      this.props.syncValidations.forEach((validationMethod) => {
        const syncValidator = new SyncValidator(this.props.name, validationMethod, 100)
        this.context.strapActions.getValidationManager().addValidator(syncValidator)
      })
    }
  }

  public componentWillUnmount() {
    if (this.context.strapActions) {
      this.context.strapActions.deregisterInput(this.props.name)
    }
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

  @EventEmitter
  private handleInputBlur(e: any): void {
    const value = e.target ? e.target.value : e
    this.setState({ value, isTouched: true }, () => {
      // validate sync and async current component
    })
  }

  @EventEmitter
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
    return !!componentRenderer ? componentRenderer() : this.defaultRenderer(this._rendererProps)
  }
}
