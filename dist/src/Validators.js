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
Object.defineProperty(exports, "__esModule", { value: true });
var EValidationType;
(function (EValidationType) {
    EValidationType["SYNC"] = "SYNC";
    EValidationType["ASYNC"] = "ASYNC";
})(EValidationType = exports.EValidationType || (exports.EValidationType = {}));
var EResultType;
(function (EResultType) {
    EResultType["WARNING"] = "WARNING";
    EResultType["ERROR"] = "ERROR";
    EResultType["SUCCESS"] = "SUCCESS";
})(EResultType = exports.EResultType || (exports.EResultType = {}));
var Validator = /** @class */ (function () {
    function Validator(targetName, method, precedence, type) {
        if (precedence === void 0) { precedence = 0; }
        if (type === void 0) { type = EValidationType.SYNC; }
        this._targetName = targetName;
        this._method = method;
        this._precedence = precedence;
        this._type = type;
    }
    Object.defineProperty(Validator.prototype, "targetName", {
        get: function () {
            return this._targetName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Validator.prototype, "precedence", {
        get: function () {
            return this._precedence;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Validator.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Validator.prototype.validate = function (data, formData, eventDispatch) {
        var _this = this;
        return new Promise(function (resolve) {
            var getData = function (result) {
                return {
                    value: data.value,
                    result: result.resultType,
                    validator: {
                        targetName: _this._targetName,
                        precedence: _this._precedence,
                        validatorType: _this._type,
                    },
                    code: result.code,
                    message: result.message,
                };
            };
            switch (_this._type) {
                case EValidationType.SYNC:
                    var resultSync = _this._method(data, formData);
                    resolve(getData(resultSync));
                    break;
                case EValidationType.ASYNC:
                    _this._method(data, formData).then(function (resultAsync) {
                        resolve(getData(resultAsync));
                    });
                    break;
            }
        });
    };
    return Validator;
}());
exports.Validator = Validator;
var SyncValidator = /** @class */ (function (_super) {
    __extends(SyncValidator, _super);
    function SyncValidator(targetName, method, precedence) {
        if (precedence === void 0) { precedence = 0; }
        return _super.call(this, targetName, method, precedence, EValidationType.SYNC) || this;
    }
    return SyncValidator;
}(Validator));
exports.SyncValidator = SyncValidator;
var AsyncValidator = /** @class */ (function (_super) {
    __extends(AsyncValidator, _super);
    function AsyncValidator(targetName, method, precedence) {
        if (precedence === void 0) { precedence = 0; }
        return _super.call(this, targetName, method, precedence, EValidationType.ASYNC) || this;
    }
    return AsyncValidator;
}(Validator));
exports.AsyncValidator = AsyncValidator;
//# sourceMappingURL=Validators.js.map