import React from 'react'
import { storiesOf, action } from '@storybook/react'

import Playground from '../storybook-components/Playground'

storiesOf('Core Components', module)
  .addWithInfo(
    'Default',
    'Accordions allow users to expand and collapse sections of content.',
    () => <Playground />
)
