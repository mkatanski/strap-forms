"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Extendable = /** @class */ (function () {
    function Extendable(settings) {
        if (settings)
            this._settings = settings;
    }
    Object.defineProperty(Extendable.prototype, "eventsManager", {
        get: function () {
            return this._settings ? this._settings.eventsManager : null;
        },
        enumerable: true,
        configurable: true
    });
    return Extendable;
}());
exports.Extendable = Extendable;
//# sourceMappingURL=Extendable.js.map