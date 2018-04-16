"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validators_1 = require("./Validators");
var EventsManager_1 = require("./EventsManager");
var Extendable_1 = require("./Extendable");
var ValidationManager = /** @class */ (function (_super) {
    __extends(ValidationManager, _super);
    function ValidationManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isValidating = false;
        _this._validators = [];
        /**
         * List of Result type which prevents from async validation
         */
        _this.breakOnSyncError = [Validators_1.EResultType.ERROR];
        return _this;
    }
    Object.defineProperty(ValidationManager.prototype, "isValidating", {
        /**
         * check if instance is currently processing validations
         */
        get: function () {
            return this._isValidating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationManager.prototype, "validators", {
        /**
         * get an array of assigned validators
         */
        get: function () {
            return this._validators;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * add new validator to the list
     * @param validator
     */
    ValidationManager.prototype.addValidator = function (validator) {
        this._validators.push(validator);
    };
    /**
     * clear all validators
     */
    ValidationManager.prototype.clearValidators = function () {
        this._validators = [];
    };
    /**
     * remove all validators for given target
     * @param targetName
     */
    ValidationManager.prototype.removeValidator = function (targetName) {
        this._validators = this._validators.filter(function (validator) { return validator.targetName !== targetName; });
    };
    /**
     * perform validation only on specific target
     * @param targetName
     * @param data
     * @emits [on_before|on_after]_validateTarget
     */
    ValidationManager.prototype.validateTarget = function (targetName, data) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runValidation(data, targetName)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * perform validation on all targets
     * @param data
     * @emits [on_before|on_after]_validateAll
     */
    ValidationManager.prototype.validateAll = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runValidation(data)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    ValidationManager.prototype.getValidators = function (data, type, targetName) {
        var validators = this.validators
            .filter(function (validator) {
            var correctTarget = targetName ? validator.targetName === targetName : true;
            return validator.type === type && correctTarget;
        })
            .sort(function (a, b) { return a.precedence - b.precedence; })
            .map(function (validator) {
            return validator.validate(data[validator.targetName], data, function () { });
        });
        return validators;
    };
    ValidationManager.prototype.runValidation = function (data, targetName) {
        return __awaiter(this, void 0, void 0, function () {
            var shouldValidateAsync, syncResult, asyncResult, errors, warnings, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        shouldValidateAsync = true;
                        syncResult = [];
                        asyncResult = [];
                        this._isValidating = true;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(this.getValidators(data, Validators_1.EValidationType.SYNC, targetName))];
                    case 2:
                        syncResult = _c.sent();
                        errors = syncResult.filter(function (res) { return res.result === Validators_1.EResultType.ERROR; });
                        warnings = syncResult.filter(function (res) { return res.result === Validators_1.EResultType.WARNING; });
                        if (this.checkBreak(errors, Validators_1.EResultType.ERROR))
                            shouldValidateAsync = false;
                        if (this.checkBreak(warnings, Validators_1.EResultType.WARNING))
                            shouldValidateAsync = false;
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (!shouldValidateAsync) return [3 /*break*/, 8];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, Promise.all(this.getValidators(data, Validators_1.EValidationType.ASYNC, targetName))];
                    case 6:
                        asyncResult = _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _b = _c.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        this._isValidating = false;
                        return [2 /*return*/, syncResult.concat(asyncResult)];
                }
            });
        });
    };
    ValidationManager.prototype.checkBreak = function (array, type) {
        return this.breakOnSyncError.findIndex(function (b) { return b === type; }) !== -1 && array.length !== 0;
    };
    __decorate([
        EventsManager_1.EventEmitter,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], ValidationManager.prototype, "validateTarget", null);
    __decorate([
        EventsManager_1.EventEmitter,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ValidationManager.prototype, "validateAll", null);
    return ValidationManager;
}(Extendable_1.Extendable));
exports.ValidationManager = ValidationManager;
//# sourceMappingURL=ValidationManager.js.map