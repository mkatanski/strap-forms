import { TInputsData } from './Form'
import { TInputData } from './Input'

export type ValidationResult = {
  resultType: EResultType
  message?: string
  code?: number
}

export type ValidationData = {
  value: any,
  result: EResultType
  validator: {
    targetName: string
    precedence: number
    validatorType: EValidationType
  }
  code?: number
  message?: string
}

export enum EValidationType {
  SYNC = 'SYNC',
  ASYNC = 'ASYNC'
}

export enum EResultType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface IValidator {
  targetName: string
  precedence: number
  type: EValidationType
  validate: (data: TInputData, formData: TInputsData, eventDispatch: () => void) => Promise<ValidationData>
}

export type TSyncValidationMethod = (
  data: TInputData,
  formData: TInputsData,
) => ValidationResult

export type TAsyncValidationMethod = (
  data: TInputData,
  formData: TInputsData,
) => Promise<ValidationResult>

export class Validator {
  private _targetName: string
  protected _method: TSyncValidationMethod | TAsyncValidationMethod
  private _precedence: number
  private _type: EValidationType

  constructor(
    targetName: string,
    method: TSyncValidationMethod | TAsyncValidationMethod,
    precedence: number = 0,
    type: EValidationType = EValidationType.SYNC
  ) {
    this._targetName = targetName
    this._method = method
    this._precedence = precedence
    this._type = type
  }

  get targetName(): string {
    return this._targetName
  }

  get precedence(): number {
    return this._precedence
  }

  get type(): EValidationType {
    return this._type
  }

  validate(data: TInputData, formData: TInputsData, eventDispatch: () => void): Promise<ValidationData> {
    return new Promise((resolve) => {
      const getData = (result: ValidationResult): ValidationData => {
        return <ValidationData>{
          value: data.value,
          result: result.resultType,
          validator: {
            targetName: this._targetName,
            precedence: this._precedence,
            validatorType: this._type,
          },
          code: result.code,
          message: result.message,
        }
      }

      switch (this._type) {
        case EValidationType.SYNC:
          const resultSync = this._method(data, formData) as ValidationResult
          resolve(getData(resultSync))
          break;
        case EValidationType.ASYNC:
          (this._method(data, formData) as Promise<ValidationResult>).then((resultAsync) => {
            resolve(getData(resultAsync))
          })
          break;
      }
    })
  }
}

export class SyncValidator extends Validator implements IValidator {
  constructor(targetName: string, method: TSyncValidationMethod, precedence: number = 0) {
    super(targetName, method, precedence, EValidationType.SYNC)
  }
}

export class AsyncValidator extends Validator implements IValidator {
  constructor(targetName: string, method: TAsyncValidationMethod, precedence: number = 0) {
    super(targetName, method, precedence, EValidationType.ASYNC)
  }
}
