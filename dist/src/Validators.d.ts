import { TInputsData } from './Form';
import { TInputData } from './Input';
export declare type ValidationResult = {
    resultType: EResultType;
    message?: string;
    code?: number;
};
export declare type ValidationData = {
    value: any;
    result: EResultType;
    validator: {
        targetName: string;
        precedence: number;
        validatorType: EValidationType;
    };
    code?: number;
    message?: string;
};
export declare enum EValidationType {
    SYNC = "SYNC",
    ASYNC = "ASYNC",
}
export declare enum EResultType {
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
}
export interface IValidator {
    targetName: string;
    precedence: number;
    type: EValidationType;
    validate: (data: TInputData, formData: TInputsData, eventDispatch: () => void) => Promise<ValidationData>;
}
export declare type TSyncValidationMethod = (data: TInputData, formData: TInputsData) => ValidationResult;
export declare type TAsyncValidationMethod = (data: TInputData, formData: TInputsData) => Promise<ValidationResult>;
export declare class Validator {
    private _targetName;
    protected _method: TSyncValidationMethod | TAsyncValidationMethod;
    private _precedence;
    private _type;
    constructor(targetName: string, method: TSyncValidationMethod | TAsyncValidationMethod, precedence?: number, type?: EValidationType);
    readonly targetName: string;
    readonly precedence: number;
    readonly type: EValidationType;
    validate(data: TInputData, formData: TInputsData, eventDispatch: () => void): Promise<ValidationData>;
}
export declare class SyncValidator extends Validator implements IValidator {
    constructor(targetName: string, method: TSyncValidationMethod, precedence?: number);
}
export declare class AsyncValidator extends Validator implements IValidator {
    constructor(targetName: string, method: TAsyncValidationMethod, precedence?: number);
}
