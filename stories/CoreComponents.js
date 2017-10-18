import React from 'react'
import { storiesOf } from '@storybook/react'

import Section from '../storybook-components/Section'
import MyForm from '../storybook-components/basic-usage-guide/custom/MyForm'
import BasicForm from '../storybook-components/reactstrap/basic-form/ReactstrapForm'

storiesOf('Basic Usage Guide', module)
  .add('Creating simple form using custom components', () => (
    <Section
      storyTitle="Creating simple form using custom components"
    >
      <MyForm />
    </Section>
  ))

storiesOf('Reactstrap', module)
  .add('Basic Form', () => (
    <Section
      storyTitle="Basic Form"
    >
      <BasicForm />
    </Section>
  ))
