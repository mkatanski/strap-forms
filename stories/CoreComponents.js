import React from 'react'
import { storiesOf } from '@storybook/react'

import Section from '../examples/Section'
import MyForm from '../examples/basic-usage-guide/MyForm'
import BasicForm from '../examples/reactstrap/basic-form'
import Programmatic from '../examples/reactstrap/programmatic-submission'

storiesOf('Basic Usage Guide', module)
  .add('Creating simple form using custom components', () => (
    <Section
      storyTitle="Creating simple form using custom components"
    >
      <MyForm />
    </Section>
  ))

storiesOf('Examples with Reactstrap', module)
  .add('Basic Form', () => (
    <Section
      storyTitle="Basic Form"
    >
      <BasicForm />
    </Section>
  ))
  .add('Progrmmatic submission and validation', () => (
    <Section
      storyTitle="Progrmmatic submission and validation"
    >
      <Programmatic />
    </Section>
  ))
