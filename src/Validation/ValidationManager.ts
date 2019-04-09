
import {
  IValidationClass,
  TFormValues,
  TInputsList,
  TStepMethod,
  TValidationMethod,
  ValidationStage,
  TValidators,
  TValidationSteps,
  TValidator
} from './types'

/**
 * @hidden
 */
function isClassValidator(validator: IValidationClass): validator is IValidationClass {
  return (<IValidationClass>validator).validate !== undefined;
}

/**
 * @hidden
 */
const onStepIteration = (
  inputName: string,
  validator: TValidator,
  formValues: TFormValues,
  stage: ValidationStage
) => {
  if (!isClassValidator(<IValidationClass>validator)) {
    const method: TValidationMethod = <TValidationMethod>validator
    return method(formValues[inputName], Object.freeze({ ...formValues }))
  }

  const instance: IValidationClass = <IValidationClass>validator
  instance.resetState();

  const runStageMethod = (methodName: ValidationStage) => {
    return instance[methodName] &&
      instance[methodName](formValues[inputName], Object.freeze({ ...formValues }));
  }

  if (stage !== ValidationStage.validate) {
    runStageMethod(stage)
  }

  if (instance.isValidationPrevented) {
    return instance.valueOnPrevented;
  }

  return runStageMethod(ValidationStage.validate)
}

/**
 * @hidden
 */
const buildValidationPromises = (
  inputs: TInputsList,
  inputName: string,
  formValues: TFormValues,
  stage: ValidationStage = ValidationStage.onSubmit
) => {
  const stepsPromises = inputs[inputName].map(
    step => step.map(validator => onStepIteration(inputName, validator, formValues, stage))
  );

  // return flattend array of promises
  return [].concat.apply([], stepsPromises);
}


/**
 * @hidden
 */
export class ValidationManager {

  inputs: TInputsList = {}

  updateInputs = (inputName: string, value: TValidationSteps) => {
    this.inputs = Object.freeze({
      ...this.inputs,
      [inputName]: value
    })
  }

  registerValidator(inputName: string, validator: TValidator) {
    this.registerValidatorsStep(inputName, [validator], 0)
  }

  registerValidatorsStep(inputName: string, validators: TValidators, stepIndex: number = -1) {
    if (!this.inputs[inputName]) {
      this.updateInputs(inputName, [validators]);
      return;
    }

    // If there is already input registered and stepIndex is set
    // update specific step
    if (stepIndex > -1) {
      const selectedSet = this.inputs[inputName][stepIndex];
      const updatedSet = [...selectedSet, ...validators];
      this.inputs[inputName][stepIndex] = updatedSet;
      return;
    }

    // otherwise add new validation step with list of given validators
    this.updateInputs(inputName, [...this.inputs[inputName], validators]);
  }

  async validate(
    inputName: string,
    formValues: TFormValues = {},
    stage: ValidationStage = ValidationStage.onSubmit
  ) {
    try {
      const promises = buildValidationPromises(this.inputs, inputName, formValues, stage);
      return await Promise.all(promises);
    } catch(e) { }
    return [];
  }

  async validateAll(formValues: TFormValues, step: ValidationStage) {
    let promises: Array<any> = [];
    Object.keys(this.inputs).map(inputName => {
      const inputPromises = buildValidationPromises(this.inputs, inputName, formValues, step);
      promises = [
        ...promises,
        ...inputPromises
      ]
    })

    try {
      return await Promise.all(promises)
    } catch (e) { }

    return [];
  }
}
