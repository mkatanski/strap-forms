import React from 'react';
import { storiesOf, action } from '@storybook/react';

const props = {
  onHeadingClick: ({ isOpen }) => {
    console.log(`Is open: ${isOpen}`);
  }, // eslint-disable-line no-console
};

storiesOf('Core Components', module)
  .addWithInfo(
  'Default',
  'Accordions allow users to expand and collapse sections of content.',
  () =>
    <div>test</div>
);
