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
var EventData = /** @class */ (function () {
    function EventData(args) {
        this._args = args;
    }
    Object.defineProperty(EventData.prototype, "methodArguments", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    return EventData;
}());
exports.EventData = EventData;
var EventDataAfter = /** @class */ (function (_super) {
    __extends(EventDataAfter, _super);
    function EventDataAfter(args, result) {
        var _this = _super.call(this, args) || this;
        _this._result = result;
        return _this;
    }
    Object.defineProperty(EventDataAfter.prototype, "Result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    return EventDataAfter;
}(EventData));
exports.EventDataAfter = EventDataAfter;
var EventsManager = /** @class */ (function () {
    function EventsManager() {
        this._listeners = {};
    }
    EventsManager.prototype.addListener = function (eventName, cb) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(cb);
    };
    EventsManager.prototype.removeListener = function (eventName) {
        delete this._listeners[eventName];
    };
    EventsManager.prototype.clearListeners = function () {
        this._listeners = {};
    };
    EventsManager.prototype.dispatchEvent = function (methodName, eData) {
        var listeners;
        if (eData instanceof EventData) {
            listeners = this._listeners["on_before_" + methodName];
        }
        if (eData instanceof EventDataAfter) {
            listeners = this._listeners["on_after_" + methodName];
        }
        if (!listeners)
            return;
        listeners.forEach(function (listenerMethod) {
            listenerMethod(eData);
            console.log(eData);
        });
    };
    return EventsManager;
}());
exports.EventsManager = EventsManager;
function EventEmitter(target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.eventsManager && this.eventsManager.dispatchEvent(propertyKey, new EventData(args));
        var result = originalMethod.apply(this, args);
        this.eventsManager && this.eventsManager.dispatchEvent(propertyKey, new EventDataAfter(args, result));
        return result;
    };
    return descriptor;
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventsManager.js.map