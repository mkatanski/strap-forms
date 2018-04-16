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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var Validators_1 = require("./Validators");
var EventsManager_1 = require("./EventsManager");
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            value: _this.props.value,
            isPristine: true,
            isTouched: false,
            isValid: false,
        };
        return _this;
    }
    Input.prototype.componentDidMount = function () {
        var _this = this;
        if (this.context.strapActions) {
            this.context.strapActions.registerInput(this.props.name, this.state);
            this.eventsManager = this.context.strapActions.getEventManager();
            // Prepare and add all sync validation methods
            this.props.syncValidations.forEach(function (validationMethod) {
                var syncValidator = new Validators_1.SyncValidator(_this.props.name, validationMethod, 100);
                _this.context.strapActions.getValidationManager().addValidator(syncValidator);
            });
        }
    };
    Input.prototype.componentWillUnmount = function () {
        if (this.context.strapActions) {
            this.context.strapActions.deregisterInput(this.props.name);
        }
    };
    Input.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    };
    Object.defineProperty(Input.prototype, "_rendererProps", {
        get: function () {
            return {
                className: this.props.className,
                onChange: this.handleInputChange,
                onBlur: this.handleInputBlur,
                value: this.state && this.state.value,
                name: this.props.name,
            };
        },
        enumerable: true,
        configurable: true
    });
    Input.prototype.handleInputBlur = function (e) {
        var value = e.target ? e.target.value : e;
        this.setState({ value: value, isTouched: true }, function () {
            // validate sync and async current component
        });
    };
    Input.prototype.handleInputChange = function (e) {
        var value = e.target ? e.target.value : e;
        this.setState({ value: value, isPristine: false }, function () {
            // validate sync only and if isTouched === true
        });
    };
    Input.prototype.defaultRenderer = function (props) {
        return (React.createElement("input", { className: props.className, onChange: props.onChange, onBlur: props.onBlur, value: props.value, name: props.name }));
    };
    Input.prototype.render = function () {
        var _a = this.props, componentRenderer = _a.componentRenderer, children = _a.children;
        var renderMethod = !!componentRenderer ? componentRenderer : this.defaultRenderer;
        return renderMethod(this._rendererProps);
    };
    Input.defaultProps = {
        name: '',
        value: '',
        syncValidations: []
    };
    Input.contextTypes = {
        strapActions: PropTypes.object
    };
    __decorate([
        EventsManager_1.EventEmitter,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Input.prototype, "handleInputBlur", null);
    __decorate([
        EventsManager_1.EventEmitter,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Input.prototype, "handleInputChange", null);
    return Input;
}(React.Component));
exports.Input = Input;
//# sourceMappingURL=Input.js.map