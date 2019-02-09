import React, { Component } from 'react'
import {
  Field,
  Textarea,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'

class MomentCreateForm extends Component {
  state = {
    text: ''
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
  }

  onCancel = () => {
    this.setState({ text: '' })
  }

  render() {
    return (
      <form className="moment-create-form" onSubmit={this.onSubmit}>
        <Field>
          <Textarea
            name="text"
            onChange={this.onChange}
            placeholder="Add moment here!"
            rows={5}
            value={this.state.text}
          />
        </Field>
        <SubmitFooter
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      </form>
    )
  }
}

export default MomentCreateForm
