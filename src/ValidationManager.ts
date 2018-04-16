
import {
  SyncValidator,
  IValidator,
  EResultType,
  EValidationType,
  ValidationData,
} from './Validators'

import { TInputsData } from './Form'
import { EventEmitter } from './EventsManager'
import { Extendable, IExtendable } from './Extendable'

export interface IValidationManager {
  /**
   * check if instance is currently processing validations
   */
  isValidating: boolean
  /**
   * get an array of assigned validators
   */
  validators: Array<IValidator>

  /**
   * List of Result type which prevents from async validation
   */
  breakOnSyncError: EResultType[]

  /**
   * perform validation only on specific target
   * @param targetName
   * @param data
   */
  validateTarget: (targetName: string, data: TInputsData) => Promise<ValidationData[]>

  /**
   * perform validation on all targets
   * @param data
   */
  validateAll: (data: TInputsData) => Promise<ValidationData[]>

  /**
   * add new validator to the list
   * @param validator
   */
  addValidator: (validator: IValidator) => void

  /**
   * remove all validators for given target
   * @param targetName
   */
  removeValidator: (targetName: string) => void

  /**
   * clear all validators
   */
  clearValidators: () => void
}

export class ValidationManager extends Extendable implements IValidationManager, IExtendable {
  private _isValidating: boolean = false
  private _validators: Array<IValidator> = []

  /**
   * List of Result type which prevents from async validation
   */
  public breakOnSyncError: EResultType[] = [EResultType.ERROR]

  /**
   * check if instance is currently processing validations
   */
  public get isValidating(): boolean {
    return this._isValidating
  }

  /**
   * get an array of assigned validators
   */
  public get validators(): Array<IValidator> {
    return this._validators
  }

  /**
   * add new validator to the list
   * @param validator
   */
  public addValidator(validator: IValidator): void {
    this._validators.push(validator)
  }

  /**
   * clear all validators
   */
  public clearValidators(): void {
    this._validators = []
  }

  /**
   * remove all validators for given target
   * @param targetName
   */
  public removeValidator(targetName: string): void {
    this._validators = this._validators.filter((validator) => validator.targetName !== targetName)
  }

  /**
   * perform validation only on specific target
   * @param targetName
   * @param data
   * @emits [on_before|on_after]_validateTarget
   */
  @EventEmitter
  public async validateTarget(targetName: string, data: TInputsData): Promise<ValidationData[]> {
    const results = await this.runValidation(data, targetName)
    return results
  }

  /**
   * perform validation on all targets
   * @param data
   * @emits [on_before|on_after]_validateAll
   */
  @EventEmitter
  public async validateAll(data: TInputsData): Promise<ValidationData[]> {
    const results = await this.runValidation(data)
    return results
  }

  private getValidators(data: TInputsData, type: EValidationType, targetName?: string): Promise<ValidationData>[] {
    const validators = this.validators
      .filter((validator) => {
        const correctTarget = targetName ? validator.targetName === targetName : true
        return validator.type === type && correctTarget
      })
      .sort((a, b) => a.precedence - b.precedence)
      .map((validator) =>
        validator.validate(data[validator.targetName], data, () => { }))

    return validators
  }

  private async runValidation(data: TInputsData, targetName?: string): Promise<ValidationData[]> {
    let shouldValidateAsync = true
    let syncResult: ValidationData[] = []
    let asyncResult: ValidationData[] = []

    this._isValidating = true

    try {
      syncResult = await Promise.all(this.getValidators(data, EValidationType.SYNC, targetName))
      const errors = syncResult.filter(res => res.result === EResultType.ERROR)
      const warnings = syncResult.filter(res => res.result === EResultType.WARNING)
      if (this.checkBreak(errors, EResultType.ERROR)) shouldValidateAsync = false
      if (this.checkBreak(warnings, EResultType.WARNING)) shouldValidateAsync = false
    } catch { }

    if(shouldValidateAsync) {
      try {
        asyncResult = await Promise.all(this.getValidators(data, EValidationType.ASYNC, targetName))
      } catch { }
    }

    this._isValidating = false
    return syncResult.concat(asyncResult)
  }

  private checkBreak(array: ValidationData[], type: EResultType): boolean {
    return this.breakOnSyncError.findIndex(b => b === type) !== -1 && array.length !== 0
  }
}
