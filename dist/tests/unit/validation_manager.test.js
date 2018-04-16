"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof jasmine !== 'undefined')
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
var ValidationManager_1 = require("../../src/ValidationManager");
var EventsManager_1 = require("../../src/EventsManager");
var Validators_1 = require("../../src/Validators");
var getInputData = function (value) { return ({
    value: value,
    isPristine: true,
    isTouched: false,
    isValid: false,
}); };
describe('ValidationManager', function () {
    var getResult = function (value, type, mode) {
        if (mode === void 0) { mode = ''; }
        switch (type) {
            case Validators_1.EResultType.ERROR:
                return value === "invalid" + mode ? Validators_1.EResultType.ERROR : Validators_1.EResultType.SUCCESS;
            case Validators_1.EResultType.WARNING:
                return value === "warn" + mode ? Validators_1.EResultType.WARNING : Validators_1.EResultType.SUCCESS;
            default:
                return Validators_1.EResultType.SUCCESS;
        }
    };
    var getSyncValidator = function (inputName, type) {
        return new Validators_1.SyncValidator(inputName, function (data) {
            return ({ resultType: getResult(data.value, type) });
        });
    };
    var getAsyncValidator = function (inputName, type) {
        return new Validators_1.AsyncValidator(inputName, function (data) { return new Promise(function (resolve) {
            resolve({ resultType: getResult(data.value, type, '_async') });
        }); });
    };
    var manager;
    var eventsManager;
    it('should import the component', function () {
        expect(ValidationManager_1.ValidationManager).not.toBe(undefined);
    });
    it('should create instance', function () {
        var eventsManager = new EventsManager_1.EventsManager();
        var manager = new ValidationManager_1.ValidationManager({ eventsManager: eventsManager });
        expect(manager).not.toBe(undefined);
        expect(manager.isValidating).toBe(false);
    });
    it('should add and remove validators', function () {
        var eventsManager = new EventsManager_1.EventsManager();
        var manager = new ValidationManager_1.ValidationManager({ eventsManager: eventsManager });
        expect(manager.validators).toEqual([]);
        var validator1 = new Validators_1.SyncValidator('input1', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        var validator2 = new Validators_1.SyncValidator('input2', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        var validator3 = new Validators_1.SyncValidator('input2', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        var validator4 = new Validators_1.SyncValidator('input3', function () { return ({ resultType: Validators_1.EResultType.SUCCESS }); });
        manager.addValidator(validator1);
        manager.addValidator(validator2);
        manager.addValidator(validator3);
        manager.addValidator(validator4);
        expect(manager.validators.length).toBe(4);
        expect(manager.validators[0].targetName).toBe('input1');
        expect(manager.validators[1].targetName).toBe('input2');
        expect(manager.validators[2].targetName).toBe('input2');
        expect(manager.validators[3].targetName).toBe('input3');
        manager.removeValidator('input2');
        expect(manager.validators.length).toBe(2);
        expect(manager.validators[0].targetName).toBe('input1');
        expect(manager.validators[1].targetName).toBe('input3');
        manager.clearValidators();
        expect(manager.validators.length).toBe(0);
    });
    describe('on specific target', function () {
        var checkInputs = function (cd) {
            return manager.validateTarget(cd.input, {
                'input1': { value: cd.value1, isPristine: true, isTouched: false, isValid: false },
                'input2': { value: cd.value2, isPristine: true, isTouched: false, isValid: false },
            }).then(function (results) {
                var errors = results.filter(function (res) { return res.result === Validators_1.EResultType.ERROR; });
                var success = results.filter(function (res) { return res.result === Validators_1.EResultType.SUCCESS; });
                var warnings = results.filter(function (res) { return res.result === Validators_1.EResultType.WARNING; });
                expect(errors.length).toBe(cd.errors);
                expect(success.length).toBe(cd.success);
                expect(warnings.length).toBe(cd.warnings);
                // all sync validation passed so the result shoould be both async and sync
                expect(results.length).toBe(cd.total);
            });
        };
        var syncValidatorsInput1 = 3;
        var asyncValidatorsInput1 = 4;
        var syncValidatorsInput2 = 1;
        var asyncValidatorsInput2 = 3;
        var validatorsTotalInput1 = syncValidatorsInput1 + asyncValidatorsInput1;
        var validatorsTotalInput2 = syncValidatorsInput2 + asyncValidatorsInput2;
        beforeAll(function () {
            eventsManager = new EventsManager_1.EventsManager();
            manager = new ValidationManager_1.ValidationManager({ eventsManager: eventsManager });
            var validators = [
                getSyncValidator('input1', Validators_1.EResultType.ERROR),
                getSyncValidator('input1', Validators_1.EResultType.WARNING),
                getSyncValidator('input1', Validators_1.EResultType.ERROR),
                getSyncValidator('input2', Validators_1.EResultType.ERROR),
                getAsyncValidator('input1', Validators_1.EResultType.ERROR),
                getAsyncValidator('input1', Validators_1.EResultType.ERROR),
                getAsyncValidator('input1', Validators_1.EResultType.WARNING),
                getAsyncValidator('input1', Validators_1.EResultType.ERROR),
                getAsyncValidator('input2', Validators_1.EResultType.ERROR),
                getAsyncValidator('input2', Validators_1.EResultType.ERROR),
                getAsyncValidator('input2', Validators_1.EResultType.WARNING),
            ];
            validators.forEach(function (v) { manager.addValidator(v); });
        });
        describe('with default settings', function () {
            it('should return SUCCESS only for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'valid',
                    value2: 'invalid',
                    errors: 0,
                    success: validatorsTotalInput1,
                    warnings: 0,
                    total: validatorsTotalInput1
                });
            });
            it('should return ERRORS results for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid',
                    value2: 'invalid',
                    errors: 2,
                    success: 1,
                    warnings: 0,
                    total: syncValidatorsInput1
                });
            });
            it('should return WARNING results for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn',
                    value2: 'warn',
                    errors: 0,
                    success: validatorsTotalInput1 - 1,
                    warnings: 1,
                    total: validatorsTotalInput1
                });
            });
            it('should return SUCCESS results for input2', function () {
                return checkInputs({
                    input: 'input2',
                    value1: 'invalid',
                    value2: 'valid',
                    errors: 0,
                    success: validatorsTotalInput2,
                    warnings: 0,
                    total: validatorsTotalInput2
                });
            });
            it('should return ERRORS results for input2', function () {
                return checkInputs({
                    input: 'input2',
                    value1: 'invalid',
                    value2: 'invalid',
                    errors: 1,
                    success: syncValidatorsInput2 - 1,
                    warnings: 0,
                    total: syncValidatorsInput2
                });
            });
            it('should return no WARNING results for input2', function () {
                return checkInputs({
                    input: 'input2',
                    value1: 'warn',
                    value2: 'warn',
                    errors: 0,
                    success: validatorsTotalInput2,
                    warnings: 0,
                    total: validatorsTotalInput2
                });
            });
            it('should asynchrounously return ERROR result for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid_async',
                    value2: 'invalid_async',
                    errors: 3,
                    success: 4,
                    warnings: 0,
                    total: validatorsTotalInput1
                });
            });
            it('should asynchrounously return ERROR result for input2', function () {
                return checkInputs({
                    input: 'input2',
                    value1: 'invalid_async',
                    value2: 'invalid_async',
                    errors: 2,
                    success: 2,
                    warnings: 0,
                    total: validatorsTotalInput2
                });
            });
            it('should asynchrounously return WARNING result for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn_async',
                    value2: 'warn_async',
                    errors: 0,
                    success: 6,
                    warnings: 1,
                    total: validatorsTotalInput1
                });
            });
            it('should asynchrounously return WARNING result for input2', function () {
                return checkInputs({
                    input: 'input2',
                    value1: 'warn_async',
                    value2: 'warn_async',
                    errors: 0,
                    success: 3,
                    warnings: 1,
                    total: validatorsTotalInput2
                });
            });
        });
        describe('with custom break on sync error', function () {
            beforeAll(function () {
                manager.breakOnSyncError = [Validators_1.EResultType.WARNING];
            });
            it('should return ERRORS results for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid',
                    value2: 'invalid',
                    errors: 2,
                    success: 5,
                    warnings: 0,
                    total: validatorsTotalInput1
                });
            });
            it('should return WARNING results for input1', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn',
                    value2: 'warn',
                    errors: 0,
                    success: 2,
                    warnings: 1,
                    total: syncValidatorsInput1
                });
            });
        });
    });
    describe('on all targets', function () {
        var checkInputs = function (cd) {
            return manager.validateAll({
                'input1': { value: cd.value1, isPristine: true, isTouched: false, isValid: false },
                'input2': { value: cd.value2, isPristine: true, isTouched: false, isValid: false },
            }).then(function (results) {
                var errors = results.filter(function (res) { return res.result === Validators_1.EResultType.ERROR; });
                var success = results.filter(function (res) { return res.result === Validators_1.EResultType.SUCCESS; });
                var warnings = results.filter(function (res) { return res.result === Validators_1.EResultType.WARNING; });
                expect(errors.length).toBe(cd.errors);
                expect(success.length).toBe(cd.success);
                expect(warnings.length).toBe(cd.warnings);
                // all sync validation passed so the result shoould be both async and sync
                expect(results.length).toBe(cd.total);
            });
        };
        var syncValidatorsInput1 = 2;
        var asyncValidatorsInput1 = 2;
        var syncValidatorsInput2 = 1;
        var asyncValidatorsInput2 = 2;
        var validatorsTotalInput1 = syncValidatorsInput1 + asyncValidatorsInput1;
        var validatorsTotalInput2 = syncValidatorsInput2 + asyncValidatorsInput2;
        beforeAll(function () {
            eventsManager = new EventsManager_1.EventsManager();
            manager = new ValidationManager_1.ValidationManager({
                eventsManager: eventsManager,
            });
            var validators = [
                getSyncValidator('input1', Validators_1.EResultType.ERROR),
                getSyncValidator('input1', Validators_1.EResultType.WARNING),
                getSyncValidator('input2', Validators_1.EResultType.ERROR),
                getAsyncValidator('input1', Validators_1.EResultType.ERROR),
                getAsyncValidator('input1', Validators_1.EResultType.WARNING),
                getAsyncValidator('input2', Validators_1.EResultType.ERROR),
                getAsyncValidator('input2', Validators_1.EResultType.WARNING),
            ];
            validators.forEach(function (v) { manager.addValidator(v); });
        });
        describe('with default settings', function () {
            it('should return SUCCESS for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'valid',
                    value2: 'valid',
                    errors: 0,
                    success: validatorsTotalInput1 + validatorsTotalInput2,
                    warnings: 0,
                    total: validatorsTotalInput1 + validatorsTotalInput2
                });
            });
            it('should return ERROR for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid',
                    value2: 'invalid',
                    errors: 2,
                    success: 1,
                    warnings: 0,
                    total: syncValidatorsInput1 + syncValidatorsInput2
                });
            });
            it('should return WARNING for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn',
                    value2: 'warn',
                    errors: 0,
                    success: 6,
                    warnings: 1,
                    total: validatorsTotalInput1 + validatorsTotalInput2
                });
            });
            it('should return ERROR from async for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid_async',
                    value2: 'invalid_async',
                    errors: 2,
                    success: 5,
                    warnings: 0,
                    total: validatorsTotalInput1 + validatorsTotalInput2
                });
            });
            it('should return WARNING from async for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn_async',
                    value2: 'warn_async',
                    errors: 0,
                    success: 5,
                    warnings: 2,
                    total: validatorsTotalInput1 + validatorsTotalInput2
                });
            });
        });
        describe('with custom break on sync error', function () {
            beforeAll(function () {
                manager.breakOnSyncError = [Validators_1.EResultType.WARNING];
            });
            it('should return ERROR for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'invalid',
                    value2: 'invalid',
                    errors: 2,
                    success: 5,
                    warnings: 0,
                    total: validatorsTotalInput1 + validatorsTotalInput2
                });
            });
            it('should return WARNING for all inputs', function () {
                return checkInputs({
                    input: 'input1',
                    value1: 'warn',
                    value2: 'warn',
                    errors: 0,
                    success: 2,
                    warnings: 1,
                    total: syncValidatorsInput1 + syncValidatorsInput2
                });
            });
        });
    });
});
//# sourceMappingURL=validation_manager.test.js.map