"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// import {DynaButton, EColor, ESize, EStyle, IDynaButtonProps} from "../../src";
var dyna_showcase_1 = require("dyna-showcase");
var logo_1 = require("../logo");
require('./showcase.less');
exports.default = {
    logo: React.createElement(logo_1.Logo, null),
    views: [
        {
            slug: 'intro',
            faIconName: 'circle-o-notch',
            title: 'Introduction',
            center: true,
            component: (React.createElement("div", null,
                React.createElement("h3", null, "dyna-ts-react-module-boilerplate"),
                React.createElement("h4", null,
                    "demonstrates the ",
                    React.createElement("strong", null, "dyna button"),
                    " implementation"),
                React.createElement("p", null,
                    "This is the showcase of the boilerplate, as a nice demo this boilerplate has the implementation of the ",
                    React.createElement("code", null, "dyna button"),
                    "."),
                React.createElement("p", null, "To start and work with the boilerplate:"),
                React.createElement("p", null,
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            "Implement your component under ",
                            React.createElement("code", null, "/src"),
                            " folder"),
                        React.createElement("li", null,
                            "Update the ",
                            React.createElement("code", null, "/dev/showcase/showcase.tsx"),
                            " respectively"),
                        React.createElement("li", null,
                            "Run ",
                            React.createElement("code", null, "npm start")))))),
        },
        {
            slug: 'sizes',
            faIconName: 'flask',
            title: 'rounded - white/black - sizes',
            center: true,
            component: (React.createElement("div", null, "Test")),
            wrapperStyle: {
                fontSize: "0px",
            },
            props: []
        },
        {
            slug: 'colours',
            faIconName: 'flask',
            title: 'rounded - colours',
            center: true,
            component: (React.createElement("div", null, "lol")),
            wrapperStyle: {
                fontSize: "0px",
                padding: "45px",
                backgroundColor: "grey",
            },
            props: []
        },
        {
            slug: 'the-end',
            title: 'the end',
            description: 'Thank you',
            center: true,
            component: (React.createElement("div", { style: { textAlign: 'center' } },
                React.createElement("h1", null, "The end"),
                React.createElement("div", { style: { fontSize: '20px' } },
                    React.createElement("p", null,
                        React.createElement("a", { href: "https://github.com/aneldev/dyna-ui-button" },
                            dyna_showcase_1.faIcon('github'),
                            " Github")),
                    React.createElement("p", null,
                        React.createElement("a", { href: "https://www.npmjs.com/package/dyna-ui-button" },
                            dyna_showcase_1.faIcon('square'),
                            " npm"))))),
        },
    ]
};
//# sourceMappingURL=showcase.js.map