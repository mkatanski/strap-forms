import React from 'react'

import { Label } from 'reactstrap'

import Form from './components/Form'
import Input from './components/Input'
import Group from './components/Group'
import Button from './components/Button'

class MyForm extends React.Component {
  state = {
    customValue: '',
  }

  handleSubmit = ({ values }) => {
    // eslint-disable-next-line
    console.log('Form values:', values)
  }

  handleSetValue = () => {
    this.setState({ customValue: 'Roger' })
  }

  render() {
    return (
      <div>
        <p>Form to submit</p>
        <Form onSubmit={this.handleSubmit}>
          <Group>
            <Label htmlFor="name">
              Your name <sup>&lowast;</sup>
            </Label>
            <Input
              name="name"
              required
              value={this.state.customValue}
            />
          </Group>

          <Group>
            <Label htmlFor="sname">
              Your second name
            </Label>
            <Input
              name="sname"
            />
          </Group>

          <Button>Submit</Button>
        </Form>
        <div style={{ marginTop: '40px' }}>
          <button onClick={this.handleSetValue}>Set value for name input</button>
        </div>
      </div>

    )
  }
}

export default MyForm
