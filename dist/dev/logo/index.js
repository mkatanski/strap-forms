"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var dyna_showcase_1 = require("dyna-showcase");
var styles = require('./index.module.less');
exports.Logo = function () { return (React.createElement("div", { className: styles.container },
    React.createElement("div", { className: styles.logo }, dyna_showcase_1.faIcon('cubes')),
    React.createElement("div", { className: styles.texts },
        React.createElement("div", { className: styles.line1 }, "dyna ts"),
        React.createElement("div", { className: styles.line2 }, "react module boilerplate")))); };
//# sourceMappingURL=index.js.map