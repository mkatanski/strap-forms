// import 'babel-polyfill'
import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import { checkA11y } from 'storybook-addon-a11y';
import Container from './Container';
import 'bootstrap/scss/bootstrap.scss'

addDecorator(checkA11y);
addDecorator(story => <Container story={story} />);

function loadStories() {
  const req = require.context('../stories/', true, /\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
