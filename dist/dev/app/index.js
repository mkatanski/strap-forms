"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var start_1 = require("./start");
var appWrapperID = 'app-container';
var appElement = document.createElement("DIV");
appElement.id = appWrapperID;
document.body.appendChild(appElement);
ReactDOM.render(React.createElement(start_1.default, null), appElement);
//# sourceMappingURL=index.js.map