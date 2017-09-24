import React, { Component } from 'react'
import T from 'prop-types'

import StrapForm from '../components/StrapForm'
import StrapInput, { StrapInputPropTypes } from '../components/StrapInput'

class TestForm extends Component {

  static propTypes = {
    children: T.any.isRequired,
    handleSubmit: T.func.isRequired,
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {this.props.children}
      </form>
    )
  }
}

class TestInput extends Component {
  static propTypes = {
    ...StrapInputPropTypes,
    children: T.any,
  }

  static defaultProps = {
    children: null,
  }

  renderErrors = (errors, type) => {
    if (!errors) {
      return null
    }

    const color = type === 'error' ? 'red' : 'orange'

    const styles = {
      color,
      fontSize: '0.8rem',
      marginLeft: 0,
      padding: 0,
      display: 'inline-block',
    }

    return Object.keys(errors).map(
      errorKey => <li style={styles} key={errorKey}>{errors[errorKey]}</li>
    )
  }

  render() {
    const { input, errors, warnings, touched, hasErrors, hasWarnings, isValidating } = this.props

    const style = {
      padding: 0,
      margin: 0,
    }

    return (
      <div style={{ marginBottom: '20px' }}>
        <input {...input} />
        {isValidating && <p>Async validating...</p>}
        {touched && hasErrors && <div><ul style={style}>{this.renderErrors(errors, 'error')}</ul></div>}
        {touched && hasWarnings && <div><ul style={style}>{this.renderErrors(warnings, 'warning')}</ul></div>}
      </div>
    )
  }
}

const Form = StrapForm(TestForm)
const Input = StrapInput(TestInput)

const fetchSimulate = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class Playground extends Component {

  state = {
    canSubmit: true,
  }

  handleFormSubmit = ({values}) => {
    console.log('The form is submitting', values)
  }

  handleFormUpdate = ({ isValid, isPristine, isValidating }) => {
    const canSubmit = (isPristine || isValid) && !isValidating

    if (this.state.canSubmit !== canSubmit) {
      this.setState({ canSubmit })
    }
  }

  renderInputs = (count) => {
    const inputs = []
    for (let index = 0; index < count; index += 1) {
      inputs.push(<Input
        key={`TestInput${index + 1}`}
        name={`TestInput${index + 1}`}
        initialValue={`TestInput${index + 1}`}
        validate={[
          value => (value !== 'test' ? 'Value must be "test"' : undefined),
        ]}
        warn={[
          value => (value.length > 4 ? 'Value should be less then 4 characters' : undefined),
        ]}
        asyncValidation={value => fetchSimulate(index * 1000).then(() => {
          if (value === 'test') {
            throw new Error('This name is forbidden')
          }
        })}
      />)
    }
    return inputs
  }

  render() {
    return (
      <Form
        onSubmit={this.handleFormSubmit}
        onInputChange={this.handleFormUpdate}
        onInputBlur={this.handleFormUpdate}
        onValuesChange={this.handleValuesChange}
      >
        {this.renderInputs(10)}
        <button type='submit' disabled={!this.state.canSubmit}>Submit</button>
      </Form>
    )
  }
}
