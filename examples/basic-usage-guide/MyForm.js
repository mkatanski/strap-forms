import React from 'react'

import Form from './components/Form'
import Input from './components/Input'
import SubmitButton from './components/SubmitButton'

const apiSimulate = ms => new Promise(resolve => setTimeout(resolve, ms))

class MyForm extends React.Component {
  handleSubmit = ({ values }) => {
    // eslint-disable-next-line
    console.log('The form is submitting', values)
  }

  render() {
    const isEmail = val => (/\S+@\S+\.\S+/.test(val) ? undefined : 'Invalid email')
    const gmail = val => (val.indexOf('gmail.com') === -1 ? undefined : 'Why Gmail?')
    const asyncEmail = val => apiSimulate(5000).then(() => {
      if (val === 'john.doe@example.com') {
        throw new Error('This address is already taken')
      }
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <p>Type john.doe@example.com to see async validation error</p>
        <div>
          <Input
            name="email"
            validate={[isEmail]}
            warn={[gmail]}
            asyncValidation={asyncEmail}
          />
        </div>

        <p>Same as above but without warning</p>
        <div>
          <Input
            name="secondEmail"
            validate={[isEmail]}
            asyncValidation={asyncEmail}
          />
        </div>

        <SubmitButton>Submit Form</SubmitButton>
      </Form>
    )
  }
}

export default MyForm
