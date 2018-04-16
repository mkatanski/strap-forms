"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof jasmine !== 'undefined')
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
var Validators_1 = require("../../src/Validators");
// help: https://facebook.github.io/jest/docs/expect.html
var getInputData = function (value) { return ({
    value: value,
    isPristine: true,
    isTouched: false,
    isValid: false,
}); };
describe('SyncValidator', function () {
    it('should import the component', function () {
        expect(Validators_1.SyncValidator).not.toBe(undefined);
    });
    it('should create instance', function () {
        var validator = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        expect(validator).not.toBe(undefined);
    });
    it('should have default precedence', function () {
        var validator = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        expect(validator.precedence).toBe(0);
    });
    it('should have custom precedence', function () {
        var validator = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); }, 10);
        expect(validator.precedence).toBe(10);
    });
    it('should have correct target name', function () {
        var validator = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        expect(validator.targetName).toBe('input1');
    });
    it('should be type of sync validator', function () {
        var validator = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        expect(validator.type).toBe(Validators_1.EValidationType.SYNC);
    });
    it('should return correct data as result', function () {
        var validator = new Validators_1.SyncValidator('input', function () { return ({
            resultType: Validators_1.EResultType.SUCCESS,
            code: 12,
            message: 'this will be always success'
        }); }, 1);
        var input = getInputData('test value');
        var promise = validator.validate(input, { 'input1': input, }, function () { });
        return promise.then(function (validationData) {
            expect(validationData.result).toBe(Validators_1.EResultType.SUCCESS);
            expect(validationData.message).toBe('this will be always success');
            expect(validationData.code).toBe(12);
            expect(validationData.value).toBe('test value');
            expect(validationData.validator.targetName).toBe('input');
            expect(validationData.validator.validatorType).toBe(Validators_1.EValidationType.SYNC);
            expect(validationData.validator.precedence).toBe(1);
        });
    });
    it('should validate', function () {
        var input;
        var validator = new Validators_1.SyncValidator('input1', function (data) {
            if (data.value === 'invalid') {
                return {
                    resultType: Validators_1.EResultType.ERROR,
                    code: 100,
                    message: 'invalid data',
                };
            }
            return { resultType: Validators_1.EResultType.SUCCESS };
        });
        input = getInputData('valid');
        var promiseValid = validator.validate(input, { 'input1': input, }, function () { });
        input = getInputData('invalid');
        var promiseInvalid = validator.validate(input, { 'input1': input, }, function () { });
        return Promise.all([promiseValid, promiseInvalid]).then(function (values) {
            var invalid = values.filter(function (value) { return value.result === Validators_1.EResultType.ERROR; });
            expect(invalid.length).toBe(1);
            expect(values[0].result).toBe(Validators_1.EResultType.SUCCESS);
            expect(values[0].value).toBe('valid');
            expect(values[0].message).toBe(undefined);
            expect(values[0].code).toBe(undefined);
            expect(values[0].validator.targetName).toBe('input1');
            expect(values[0].validator.validatorType).toBe(Validators_1.EValidationType.SYNC);
            expect(values[0].validator.precedence).toBe(0);
            expect(values[1].result).toBe(Validators_1.EResultType.ERROR);
            expect(values[1].value).toBe('invalid');
            expect(values[1].message).toBe('invalid data');
            expect(values[1].code).toBe(100);
            expect(values[1].validator.targetName).toBe('input1');
            expect(values[1].validator.validatorType).toBe(Validators_1.EValidationType.SYNC);
            expect(values[1].validator.precedence).toBe(0);
        });
    });
});
describe('AsyncValidator', function () {
    it('should import the component', function () {
        expect(Validators_1.AsyncValidator).not.toBe(undefined);
    });
    it('should create instance', function () {
        var validator = new Validators_1.AsyncValidator('input1', function () {
            return new Promise(function (resolve) { resolve({ resultType: Validators_1.EResultType.SUCCESS }); });
        });
        expect(validator).not.toBe(undefined);
    });
    it('should have default precedence', function () {
        var validator = new Validators_1.AsyncValidator('input1', function () {
            return new Promise(function (resolve) { resolve({ resultType: Validators_1.EResultType.SUCCESS }); });
        });
        expect(validator.precedence).toBe(0);
    });
    it('should have custom precedence', function () {
        var validator = new Validators_1.AsyncValidator('input1', function () {
            return new Promise(function (resolve) { resolve({ resultType: Validators_1.EResultType.SUCCESS }); });
        }, 10);
        expect(validator.precedence).toBe(10);
    });
    it('should have correct target name', function () {
        var validator = new Validators_1.AsyncValidator('input1', function () {
            return new Promise(function (resolve) { resolve({ resultType: Validators_1.EResultType.SUCCESS }); });
        });
        expect(validator.targetName).toBe('input1');
    });
    it('should be type of async validator', function () {
        var validator = new Validators_1.AsyncValidator('input1', function () {
            return new Promise(function (resolve) { resolve({ resultType: Validators_1.EResultType.SUCCESS }); });
        });
        expect(validator.type).toBe(Validators_1.EValidationType.ASYNC);
    });
    it('should return correct data as result', function () {
        var validator = new Validators_1.AsyncValidator('input', function () { return new Promise(function (resolve) {
            resolve({
                resultType: Validators_1.EResultType.SUCCESS,
                code: 12,
                message: 'this will be always success'
            });
        }); }, 1);
        var input = getInputData('test value');
        var promise = validator.validate(input, { 'input': input, }, function () { });
        return promise.then(function (validationData) {
            expect(validationData.result).toBe(Validators_1.EResultType.SUCCESS);
            expect(validationData.message).toBe('this will be always success');
            expect(validationData.code).toBe(12);
            expect(validationData.value).toBe('test value');
            expect(validationData.validator.targetName).toBe('input');
            expect(validationData.validator.validatorType).toBe(Validators_1.EValidationType.ASYNC);
            expect(validationData.validator.precedence).toBe(1);
        });
    });
    it('should validate', function () {
        var input;
        var validator = new Validators_1.AsyncValidator('input1', function (data) { return new Promise(function (resolve) {
            if (data.value === 'invalid') {
                resolve({
                    resultType: Validators_1.EResultType.ERROR,
                    code: 100,
                    message: 'invalid data',
                });
            }
            resolve({ resultType: Validators_1.EResultType.SUCCESS });
        }); });
        input = getInputData('valid');
        var promiseValid = validator.validate(input, { 'input1': input, }, function () { });
        input = getInputData('invalid');
        var promiseInvalid = validator.validate(input, { 'input1': input, }, function () { });
        return Promise.all([promiseValid, promiseInvalid]).then(function (values) {
            var invalid = values.filter(function (value) { return value.result === Validators_1.EResultType.ERROR; });
            expect(invalid.length).toBe(1);
            expect(values[0].result).toBe(Validators_1.EResultType.SUCCESS);
            expect(values[0].value).toBe('valid');
            expect(values[0].message).toBe(undefined);
            expect(values[0].code).toBe(undefined);
            expect(values[0].validator.targetName).toBe('input1');
            expect(values[0].validator.validatorType).toBe(Validators_1.EValidationType.ASYNC);
            expect(values[0].validator.precedence).toBe(0);
            expect(values[1].result).toBe(Validators_1.EResultType.ERROR);
            expect(values[1].value).toBe('invalid');
            expect(values[1].message).toBe('invalid data');
            expect(values[1].code).toBe(100);
            expect(values[1].validator.targetName).toBe('input1');
            expect(values[1].validator.validatorType).toBe(Validators_1.EValidationType.ASYNC);
            expect(values[1].validator.precedence).toBe(0);
        });
    });
});
//# sourceMappingURL=validators.test.js.map