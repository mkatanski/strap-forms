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
var React = require("react");
var dyna_showcase_1 = require("dyna-showcase");
var showcase_1 = require("../showcase/showcase");
var menuStyle = require('dyna-showcase/styles/menu-style-white.module.less');
require("./font-awesome.less");
require("./start.less");
var StartApp = /** @class */ (function (_super) {
    __extends(StartApp, _super);
    function StartApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StartApp.prototype.render = function () {
        return (React.createElement(dyna_showcase_1.DynaShowcase, { showcase: showcase_1.default, menuCssModule: menuStyle }));
    };
    return StartApp;
}(React.Component));
exports.default = StartApp;
//# sourceMappingURL=start.js.map