import React from 'react'

import { Label } from 'reactstrap'

import Form from './components/Form'
import Input from './components/Input'
import Group from './components/Group'
import Button from './components/Button'

const apiSimulate = ms => new Promise(resolve => setTimeout(resolve, ms))

class MyForm extends React.Component {
  handleSubmit = ({ values }) => {
    // eslint-disable-next-line
    console.log('The form is submitting', values)
  }

  handleSubmitFail = ({ errors }) => {
    console.log('Can\'t submit: ', errors)
  }

  render() {
    const isEmail = val => (val === '' || (/\S+@\S+\.\S+/.test(val)) ? undefined : 'Invalid email')
    const gmail = val => (val.indexOf('gmail.com') === -1 ? undefined : 'Why Gmail?')
    const asyncEmail = (val) => {
      if (val === '') {
        return
      }

      return apiSimulate(5000).then(() => {
        if (val === 'john.doe@example.com') {
          throw new Error('This address is already taken')
        }
      })
    }

    return (
      <Form onSubmit={this.handleSubmit} onSubmitFail={this.handleSubmitFail}>
        <Group>
          <Label htmlFor="name">
            Your name <sup>&lowast;</sup>
          </Label>
          <Input
            name="name"
            required
          />
        </Group>

        <Group>
          <Label htmlFor="email">
            First e-mail <sup>&lowast;</sup>
          </Label>
          <Input
            name="email"
            validate={[isEmail]}
            warn={[gmail]}
            asyncValidation={asyncEmail}
            required
            helpText="Type john.doe@example.com to see async error"
          />
        </Group>

        <Group>
          <Label htmlFor="secondEmail">
            Second e-mail
          </Label>
          <Input
            name="secondEmail"
            validate={[isEmail]}
            asyncValidation={asyncEmail}
            helpText="Same as above but without warning"
          />
        </Group>

        <Button disableOnValidating={false}>Submit Form</Button>
      </Form>
    )
  }
}

export default MyForm
