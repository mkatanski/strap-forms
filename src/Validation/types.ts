import { StrapValidator } from './StrapValidator'

/**
 * Describe the shape of validator class. Validator class has to extend
 * from StrapValidator to make it possible to use as a validator instance
 * in StrapForms.
 *
 * **Example of creating simple validator:**
 *
 * TypeScript
 * ```ts
 * class MyValidator extends StrapValidator implements IValidationClass {
 *
 *    validate(value: any) {
 *      return { isValid: !value }
 *    }
 *
 * }
 * ```
 */
export interface IValidationClass extends StrapValidator {
  /**
   * Triggered before validation in onChange event of the input.
   * You can perform here initial validation or memoising.
   *
   * Example:
   * ```ts
   * onChange(value: string) {
   *    if (value === '-') {
   *        this.preventValidation();
   *    }
   * }
   * ```
   */
  onChange?: TStepMethod

  /**
   * Triggered before validation in onBlur event of the input.
   * You can perform here initial validation or memoising.
   *
   * Example:
   * ```ts
   * onBlur(value: string) {
   *    if (value === '-') {
   *        this.preventValidation();
   *    }
   * }
   * ```
   */
  onBlur?: TStepMethod

  /**
   * Triggered before validation and before form submission.
   * You can perform here initial validation or memoising.
   *
   * Example:
   * ```ts
   * onSubmit(value: string) {
   *    if (value === '-') {
   *        this.preventValidation();
   *    }
   * }
   * ```
   */
  onSubmit?: TStepMethod

  /**
   * validate method performs validation.
   * it should return validation data which
   * contains information about validity of the value
   * and (if invalid) error message
   */
  validate: TValidationMethod

  /**
   * @hidden
   */
  [key: string]: any
}

/**
 * @hidden
 */
export enum ValidationStage {
  onChange = 'onChange',
  onBlur = 'onBlur',
  onSubmit = 'onSubmit',
  validate = 'validate'
}

export type TValidator = TValidationMethod | IValidationClass
export type TValidators = Array<TValidator>
export type TValidationSteps = Array<TValidators>

/**
 * Method which is triggered in each validation process
 */
export type TValidationMethod = (inputValue: any, formValues: TFormValues) => any

/**
 * Method executed at one of the validation steps in the validator class
 *
 * @param inputValue Current value of input
 * @param formValues Values of all inputs which belongs to parent form
 */
export type TStepMethod = (inputValue: any, formValues: TFormValues) => void

export type TInputsList = {
  [key: string]: TValidationSteps
}

export type TFormValues = {
  [key: string]: any
}
