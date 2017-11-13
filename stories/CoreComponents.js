import React from 'react'
import { storiesOf } from '@storybook/react'

import MyForm from '../examples/basic-usage-guide/MyForm'
import BasicForm from '../examples/reactstrap/basic-form'
import Programmatic from '../examples/reactstrap/programmatic-submission'
import SetValue from '../examples/reactstrap/set-value'

storiesOf('Basic Usage Guide', module)
  .add('Creating simple form using custom components', () => (
    <MyForm />
  ))

storiesOf('Examples with Reactstrap', module)
  .add('Basic Form', () => (
    <BasicForm />
  ))
  .add('Programmatic submission and validation', () => (
    <Programmatic />
  ))
  .add('Set value for input', () => (
    <SetValue />
  ))
