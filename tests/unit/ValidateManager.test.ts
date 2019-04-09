import {
  ValidationManager,
  TFormValues,
  IValidationClass,
  StrapValidator,
  ValidationStage
} from '../../src/Validation/';

describe('ValidationManager', () => {
  it('should exists', () => {
    const vm = new ValidationManager();
    expect(vm).toBeDefined();
  })

  describe('registerValidator', () => {
    let vm: any;
    beforeEach(() => {
      vm = new ValidationManager();
    })

    it('should have registerValidator method', () => {
      expect(vm.registerValidator).toBeDefined();
    })

    it('should add new Validator method for specific inputName', () => {
      expect(vm.inputs).toBeDefined();
      expect(vm.inputs).toEqual({})

      const cb = () => {}
      vm.registerValidator('input1', cb);

      expect(vm.inputs.input1).toBeDefined();
      expect(Array.isArray(vm.inputs.input1)).toBe(true);
      expect(vm.inputs.input1.length).toBe(1);
      expect(vm.inputs.input1[0]).toEqual([cb]);
    });

    it('should add new Validator method for multiple inputs', () => {
      expect(vm.inputs).toBeDefined();
      expect(vm.inputs).toEqual({});

      const cb = () => {}
      vm.registerValidator('input1', cb);
      vm.registerValidator('input2', cb);

      expect(vm.inputs.input1).toBeDefined();
      expect(vm.inputs.input2).toBeDefined();
      expect(Array.isArray(vm.inputs.input1)).toBe(true);
      expect(Array.isArray(vm.inputs.input2)).toBe(true);
      expect(vm.inputs.input1.length).toBe(1);
      expect(vm.inputs.input2.length).toBe(1);
      expect(vm.inputs.input1[0]).toEqual([cb]);
      expect(vm.inputs.input2[0]).toEqual([cb]);
    });

    it('should add multiple Validator methods for specific input', () => {
      expect(vm.inputs).toBeDefined();
      expect(vm.inputs).toEqual({});

      const cb1 = () => {}
      const cb2 = () => {}
      vm.registerValidator('input1', cb1);
      vm.registerValidator('input1', cb2);

      expect(vm.inputs.input1).toBeDefined();
      expect(Array.isArray(vm.inputs.input1)).toBe(true);
      expect(vm.inputs.input1.length).toBe(1);
      expect(vm.inputs.input1[0]).toEqual([cb1, cb2]);
    });

    it('should has inputs sealed', () => {
      expect(vm.inputs).toBeDefined();
      expect(vm.inputs).toEqual({});

      const cb = () => {}
      const test = () => { }

      vm.registerValidator('input1', cb);

      try {
        vm.inputs.input1 = [[test]];
      } catch (e) { }

      expect(vm.inputs.input1[0]).toEqual([cb]);
    })
  })

  describe('validate input method', () => {
    let vm: any;

    beforeEach(() => {
      vm = new ValidationManager();
    })

    it('should have validate method', () => {
      expect(vm.validate).toBeDefined();
    })

    it('should run single validation method for specific input', () => {
      let cb1RunValue = '';
      let count = 0;
      const cb1 = (value: any) => {
        count += 1;
        cb1RunValue = value;
      }
      const cb2 = () => {}

      vm.registerValidator('input1', cb1);
      vm.registerValidator('input2', cb1);
      vm.validate('input1', { input1: 'myValueTest', input2: 'another'});
      expect(cb1RunValue).toBe('myValueTest');
      expect(count).toBe(1);
    })

    it('should get empty if run validation for non existing input', () => {
      let cb1RunValue = '';
      let count = 0;
      const cb1 = (value: any) => {
        count += 1;
        cb1RunValue = value;
      }
      const cb2 = () => {}

      vm.registerValidator('input1', cb1);
      vm.registerValidator('input2', cb1);
      vm.validate('input3', { input1: 'myValueTest', input2: 'another'});
      expect(cb1RunValue).toBe('');
      expect(count).toBe(0);
    })

    it('should run multiple validation methods for specific input', () => {
      let cb1RunValue = '';
      let cb2RunValue = '';
      let cb3RunValue = '';
      let count1 = 0;
      let count2 = 0;
      let count3 = 0;
      const cb1 = (value: any) => {
        count1 += 1;
        cb1RunValue = value;
      }
      const cb2 = (value: any) => {
        count2 += 1;
        cb2RunValue = value;
      }
      const cb3 = (value: any) => {
        count3 += 1;
        cb3RunValue = value;
      }

      vm.registerValidator('input1', cb1);
      vm.registerValidator('input1', cb2);
      vm.registerValidator('input2', cb1);

      vm.validate('input1', { input1: 'myValueTest', input2: 'another'});

      expect(cb1RunValue).toBe('myValueTest');
      expect(count1).toBe(1);
      expect(cb2RunValue).toBe('myValueTest');
      expect(count2).toBe(1);
      expect(cb3RunValue).toBe('');
      expect(count3).toBe(0);
    })

    it('should resolve promise on validation', async () => {
      vm.registerValidator('input1', (value: any) => {
        return new Promise((resolve) => {
          resolve(value);
        })
      });

      vm.registerValidator('input1', (value: any) => {
        return value;
      });

      const results = await vm.validate('input1', { input1: 'someVal'});
      expect(results[0]).toBe('someVal');
      expect(results[1]).toBe('someVal');
    })

    it('should get empty array for validation of non existing input', async () => {
      vm.registerValidator('input1', (value: any) => {
        return new Promise((resolve) => {
          resolve(value);
        })
      });

      vm.registerValidator('input1', (value: any) => {
        return value;
      });

      const results = await vm.validate('input4', { input1: 'someVal'});
      expect(results).toEqual([]);
    })

    it('should pass list of all input values as second argument', () => {
      const form = {
        input1: 'value1',
        input2: 'value2',
        input3: 'value3'
      }
      let all;
      let val;
      vm.registerValidator('input1', (value: any, allValues: TFormValues) => {
        all = allValues;
        val = value;
        allValues.input1 = 'should not ref';
      });

      vm.validate('input1', form);

      expect(val).toBe('value1');
      expect(all).toEqual(form);
    })


  })

  describe('validate all inputs method', () => {
    let vm: any;
    const formValues = { input1: 'John', input2: 'Doe', input3: 'BakerStreet' }
    const formValuesNonExisting = { input4: 'John', input5: 'Doe', input6: 'BakerStreet' }

    beforeEach(() => {
      vm = new ValidationManager();
    })

    it('should have validateAll method', () => {
      expect(vm.validateAll).toBeDefined();
    })

    it('should return validation result for all inputs', async () => {
      const expectedResult = [
        { value: 'John', isValid: true },
        { value: 'John', isValid: false },
        { value: 'BakerStreet', isValid: true }
      ];

      vm.registerValidator('input1', (value: any) => new Promise((resolve) => {
        resolve({ value, isValid: true });
      }));
      vm.registerValidator('input1', (value: any) => new Promise((resolve) => {
        resolve({ value, isValid: false });
      }));
      vm.registerValidator('input3', (value: any) => new Promise((resolve) => {
        resolve({ value, isValid: true });
      }));

      const results = await vm.validateAll(formValues);
      expect(results).toEqual(expectedResult);
    })

  });

  describe('validate using StrapValidator', async () => {
    let vm: any;

    beforeEach(() => {
      vm = new ValidationManager();
    })

    it('should accept StrapValidator class', async () => {
      class TestValidator extends StrapValidator implements IValidationClass {
        validate(value: any, allValues: TFormValues) {
          return {
            value,
            allValues
          }
        }
      }

      vm.registerValidator('input1', new TestValidator());

      const result = await vm.validate('input1', {
        input1: 'value1'
      })

      expect(result).toEqual([{ value: 'value1', allValues: {
        input1: 'value1'
      } }]);
    })

    it('should return validation array from StrapValidator', async () => {
      class NoSpace extends StrapValidator implements IValidationClass {
        onChange(value: string) {
          if (value === 'Doe') {
            this.preventValidation();
          }
        }

        validate(value: any, allValues: TFormValues) {
          return new Promise((resolve) => { resolve(!<string>value.includes(' '))})
        }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      Object.keys(formValues)
        .forEach((inputName) => { vm.registerValidator(inputName, new NoSpace()) });

      const validation_results = await vm.validateAll(formValues);

      expect(validation_results).toEqual([true, true, false]);
    })

    it('should execute onChange method of StrapValidator for all inputs', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('street', new Test());
      vm.validateAll(formValues, ValidationStage.onChange);

      expect(executed).toEqual([{ value: 'Avenue Street', allValues: formValues, method: 'onChange'}]);
    })

    it('should execute onChange method of StrapValidator for specific input', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('street', new Test());
      vm.validate('street', formValues, ValidationStage.onChange);

      expect(executed).toEqual([{ value: 'Avenue Street', allValues: formValues, method: 'onChange'}]);
    })

    it('should execute onBlur method of StrapValidator for all inputs', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('second_name', new Test());
      vm.validateAll(formValues, ValidationStage.onBlur);

      expect(executed).toEqual([{ value: 'Doe', allValues: formValues, method: 'onBlur'}]);
    })

    it('should execute onBlur method of StrapValidator for specific input', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('second_name', new Test());
      vm.validate('second_name', formValues, ValidationStage.onBlur);

      expect(executed).toEqual([{ value: 'Doe', allValues: formValues, method: 'onBlur'}]);
    })

    it('should execute onSubmit method of StrapValidator for all inputs', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('name', new Test());
      vm.validateAll(formValues);

      expect(executed).toEqual([{ value: 'John', allValues: formValues, method: 'onSubmit'}]);
    })

    it('should execute onSubmit method of StrapValidator for specific input', () => {
      const executed: Array<Object> = [];
      class Test extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onChange'}) }
        onBlur(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onBlur'}) }
        onSubmit(value: string, allValues: TFormValues) { executed.push({value, allValues, method: 'onSubmit'}) }
        validate() { return 'ok' }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      vm.registerValidator('name', new Test());
      vm.validate('name', formValues);

      expect(executed).toEqual([{ value: 'John', allValues: formValues, method: 'onSubmit'}]);
    })

    it('should prevent runing validation', async () => {
      class NoSpace extends StrapValidator implements IValidationClass {
        onChange(value: string) {
          if (value === 'Doe') {
            this.preventValidation();
          }
        }

        validate(value: any, allValues: TFormValues) {
          return new Promise((resolve) => { resolve(!<string>value.includes(' '))})
        }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      Object.keys(formValues)
        .forEach((inputName) => { vm.registerValidator(inputName, new NoSpace()) });

      const validation_results = await vm.validateAll(formValues, ValidationStage.onChange);

      expect(validation_results).toEqual([true, null, false]);
    })

    it('should prevent runing validation with default value', async () => {
      class NoSpace extends StrapValidator implements IValidationClass {
        onChange(value: string, allValues: TFormValues) {
          if (value === 'Doe') {
            this.preventValidation('prevented');
          }
        }

        validate(value: any, allValues: TFormValues) {
          return new Promise((resolve) => { resolve(!<string>value.includes(' '))})
        }
      }

      const formValues = {
        name: 'John',
        second_name: 'Doe',
        street: 'Avenue Street'
      }

      const noSpace = new NoSpace();

      Object.keys(formValues)
        .forEach((inputName) => { vm.registerValidator(inputName, noSpace) });
      const validation_results = await vm.validateAll(formValues, ValidationStage.onChange);
      expect(validation_results).toEqual([true, 'prevented', false]);

      formValues.second_name = 'Example'
      const validation_results2 = await vm.validateAll(formValues, ValidationStage.onChange);
      expect(validation_results2).toEqual([true, true, false]);
    })

  })

  describe('registerValidatorsStep', () => {
    let vm: any;

    beforeEach(() => {
      vm = new ValidationManager();
    })

    it('method should exists', () => {
      expect(vm.registerValidatorsStep).toBeDefined();
    })

    it('should accept array of validators and perform validation for specific input', () => {
      let cb1Val = '';
      let cb2Val = '';

      const cb1 = (value: any) => { cb1Val = value; }
      const cb2 = (value: any) => { cb2Val = value; }

      vm.registerValidatorsStep('input1', [cb1, cb2]);
      vm.validate('input1', { input1: 'testValue' });

      expect(vm.inputs.input1.length).toBe(1);
      expect(cb1Val).toBe('testValue');
      expect(cb2Val).toBe('testValue');
    })

    it('should register multiple steps for input and validate those steps', () => {
      let cb1Val = '';
      let cb2Val = '';

      const cb1 = (value: any) => { cb1Val = value; }
      const cb2 = (value: any) => { cb2Val = value; }

      vm.registerValidatorsStep('input1', [cb1]);
      vm.registerValidatorsStep('input1', [cb2]);
      vm.validate('input1', { input1: 'testValue' });

      expect(Array.isArray(vm.inputs.input1)).toBe(true);
      expect(vm.inputs.input1.length).toBe(2);
      expect(vm.inputs.input1[0]).toEqual([cb1]);
      expect(vm.inputs.input1[1]).toEqual([cb2]);

      expect(cb1Val).toBe('testValue');
      expect(cb2Val).toBe('testValue');
    })

    it('should prevent validation of second step if first contains error', () => {


    })

  })

});
