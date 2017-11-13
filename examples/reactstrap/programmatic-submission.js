import React from 'react'

import { Label } from 'reactstrap'

import Form from './components/Form'
import Input from './components/Input'
import Group from './components/Group'

class MyForm extends React.Component {
  handleSubmit = () => {
    // eslint-disable-next-line
    console.log('Programmatic submission')
  }

  render() {
    return (
      <div>
        <p>Form to submit</p>
        <Form onSubmit={this.handleSubmit} ref={(ref) => { this.form = ref }}>
          <Group>
            <Label htmlFor="name">
              Your name <sup>&lowast;</sup>
            </Label>
            <Input
              name="name"
              required
            />
          </Group>
        </Form>
        <div>
          <p>External button</p>
          <button onClick={() => this.form.submit()}>Programmatic submission</button>
        </div>
      </div>

    )
  }
}

export default MyForm
