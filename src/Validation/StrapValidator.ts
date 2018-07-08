export class StrapValidator {
  isValidationPrevented: boolean = false
  valueOnPrevented: any = null

  preventValidation(defaultValue: any = null) {
    this.isValidationPrevented = true;
    this.valueOnPrevented = defaultValue;
  }

  resetState() {
    this.isValidationPrevented = false;
    this.valueOnPrevented = null;
  }
}
