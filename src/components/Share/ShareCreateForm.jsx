import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  Textarea,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import Share from 'model/share'
import toggleNotification from 'utils/notifier/toggleNotification'

class ShareCreateForm extends Component {
  state = {
    text: ''
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()

    const { text } = this.state
    const { username } = this.props

    const share = new Share({
      text,
      username,
      valid: true
    })

    try {
      const result = await share.save()
      if (result) {
        toggleNotification('success', 'Thanks for sharing!')
        this.setState({ text: '' })
      }
    } catch (e) {
      console.log(e.message)
    }
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
            placeholder="Share a moment here!"
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

export default ShareCreateForm
