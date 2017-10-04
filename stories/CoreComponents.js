import React from 'react'
import { storiesOf } from '@storybook/react'

import Section from '../storybook-components/Section'
import MyForm from '../storybook-components/basic-usage-guide/custom/MyForm'

storiesOf('Basic Usage Guide', module)
  .add('Creating simple form using custom components', () => (
    <Section
      storyTitle="Creating simple form using custom components"
    >
      <MyForm />
    </Section>
  ))
