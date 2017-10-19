import React from 'react'
import { storiesOf } from '@storybook/react'

import Section from '../examples/Section'
import MyForm from '../examples/basic-usage-guide/custom/MyForm'
import BasicForm from '../examples/reactstrap/basic-form'

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
