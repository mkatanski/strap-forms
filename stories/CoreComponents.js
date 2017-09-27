import React from 'react'
import { storiesOf } from '@storybook/react'

import Section from '../storybook-components/Section'
import Playground from '../storybook-components/Playground'

storiesOf('Higer Order Components', module)
  .add('StrapInput', () => (
    <Section
      storyTitle="StrapInput"
    >
      <Playground />
    </Section>
  ))
