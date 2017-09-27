import React from 'react'
import { storiesOf } from '@storybook/react'

import Playground from '../storybook-components/Playground'

storiesOf('Core Components', module)
  .add('Default', () => <Playground />)
