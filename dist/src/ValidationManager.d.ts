import { IValidator, EResultType, ValidationData } from './Validators';
import { TInputsData } from './Form';
import { Extendable, IExtendable } from './Extendable';
export interface IValidationManager {
    /**
     * check if instance is currently processing validations
     */
    isValidating: boolean;
    /**
     * get an array of assigned validators
     */
    validators: Array<IValidator>;
    /**
     * List of Result type which prevents from async validation
     */
    breakOnSyncError: EResultType[];
    /**
     * perform validation only on specific target
     * @param targetName
     * @param data
     */
    validateTarget: (targetName: string, data: TInputsData) => Promise<ValidationData[]>;
    /**
     * perform validation on all targets
     * @param data
     */
    validateAll: (data: TInputsData) => Promise<ValidationData[]>;
    /**
     * add new validator to the list
     * @param validator
     */
    addValidator: (validator: IValidator) => void;
    /**
     * remove all validators for given target
     * @param targetName
     */
    removeValidator: (targetName: string) => void;
    /**
     * clear all validators
     */
    clearValidators: () => void;
}
export declare class ValidationManager extends Extendable implements IValidationManager, IExtendable {
    private _isValidating;
    private _validators;
    /**
     * List of Result type which prevents from async validation
     */
    breakOnSyncError: EResultType[];
    /**
     * check if instance is currently processing validations
     */
    readonly isValidating: boolean;
    /**
     * get an array of assigned validators
     */
    readonly validators: Array<IValidator>;
    /**
     * add new validator to the list
     * @param validator
     */
    addValidator(validator: IValidator): void;
    /**
     * clear all validators
     */
    clearValidators(): void;
    /**
     * remove all validators for given target
     * @param targetName
     */
    removeValidator(targetName: string): void;
    /**
     * perform validation only on specific target
     * @param targetName
     * @param data
     * @emits [on_before|on_after]_validateTarget
     */
    validateTarget(targetName: string, data: TInputsData): Promise<ValidationData[]>;
    /**
     * perform validation on all targets
     * @param data
     * @emits [on_before|on_after]_validateAll
     */
    validateAll(data: TInputsData): Promise<ValidationData[]>;
    private getValidators(data, type, targetName?);
    private runValidation(data, targetName?);
    private checkBreak(array, type);
}
