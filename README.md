# strap-forms <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]

> Lightweight, expandable, simple and fast to implement forms for React.js.


![Logo](https://github.com/mkatanski/strap-forms/blob/master/logo.png)

- [Live Playground](#live-playground)
- [Getting Started](#getting-started)
  - [Install dependencies](#install-dependencies)
  - [Include component](#include-component)

## Live Playground

To run that demo on your own computer:

- Clone this repository
- `npm install`
- `npm run storybook`
- Visit [http://localhost:9000/](http://localhost:9000/)

## Getting Started

### Install dependencies

Ensure packages are installed with correct version numbers by running:

```sh
(
  export PKG=strap-forms;
  npm info "$PKG" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g; s/ *//g' | xargs npm install --save "$PKG"
)
```

  Which produces and runs a command like:

  ```sh
  npm install --save strap-forms reactstrap@>=#.## react@>=#.## react-dom@>=#.## react-addons-shallow-compare@>=#.##
  ```

### Include component

```js
// import core methods for creating your own
// custom components / quick wrap native controls
import { StrapForm, StrapInput, StrapGroup } from 'strap-forms';

```

[package-url]: https://npmjs.org/package/strap-forms
[npm-version-svg]: http://versionbadg.es/mkatanski/strap-forms.svg
[travis-svg]: https://travis-ci.org/mkatanski/strap-forms.svg
[travis-url]: https://travis-ci.org/mkatanski/strap-forms
[deps-svg]: https://david-dm.org/mkatanski/strap-forms.svg
[deps-url]: https://david-dm.org/mkatanski/strap-forms
[dev-deps-svg]: https://david-dm.org/mkatanski/strap-forms/dev-status.svg
[dev-deps-url]: https://david-dm.org/mkatanski/strap-forms#info=devDependencies
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
