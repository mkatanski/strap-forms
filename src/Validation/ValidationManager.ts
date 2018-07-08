
import {
  IValidationClass,
  TFormValues,
  TInputsList,
  TStepMethod,
  TValidationMethod,
  ValidationSteps
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
const buildValidationPromises =
  (inputs: TInputsList, inputName: string, formValues: TFormValues, step: ValidationSteps = ValidationSteps.onSubmit) =>
  inputs[inputName].map(
    validator => {
      if (isClassValidator(<IValidationClass>validator)) {
        const instance: IValidationClass = <IValidationClass>validator
        instance.resetState();

        const runStepMethod = (methodName: string) => {
          return instance[methodName] &&
            instance[methodName](formValues[inputName], Object.freeze({ ...formValues }));
        }

        switch (step) {
          case ValidationSteps.onChange:
            runStepMethod('onChange')
            break;
          case ValidationSteps.onBlur:
            runStepMethod('onBlur')
            break;
          case ValidationSteps.onSubmit:
            runStepMethod('onSubmit')
            break;
        }

        if (instance.isValidationPrevented) {
          return instance.valueOnPrevented;
        }

        return runStepMethod('validate')
      }

      const method: TValidationMethod = <TValidationMethod>validator
      return method(formValues[inputName], Object.freeze({ ...formValues }))
    }
  );

/**
 * @hidden
 */
export class ValidationManager {

  inputs: TInputsList = {}

  registerValidator(inputName: string, validator: TValidationMethod | IValidationClass) {
    const updateInputs = (value: Array<TValidationMethod | IValidationClass>) => {
      this.inputs = Object.freeze({
        ...this.inputs,
        [inputName]: value
      })
    }

    if (!this.inputs[inputName]) {
      updateInputs([validator]);
      return;
    }

    updateInputs([...this.inputs[inputName], validator]);
  }

  async validate(inputName: string, formValues: TFormValues = {}, step: ValidationSteps = ValidationSteps.onSubmit) {
    try {
      const promises = buildValidationPromises(this.inputs, inputName, formValues, step);
      return await Promise.all(promises);
    } catch(e) { }
    return [];
  }

  async validateAll(formValues: TFormValues, step: ValidationSteps) {
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
