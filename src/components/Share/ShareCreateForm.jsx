import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Field,
  Textarea,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { requestCreateShare } from 'actions/share'

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

    const params = {
      text,
      username,
      valid: true
    }

    this.props.requestCreateShare(params)
    this.setState({ text: '' })
  }

  onCancel = (e) => {
    e.preventDefault()
    this.setState({ text: '' })
  }

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      this.shareForm.submit()
    }
  }

  render() {
    return (
      <form
        ref={(shareForm) => this.shareForm = shareForm}
        className="moment-create-form"
        onSubmit={this.onSubmit}
      >
        <Field>
          <Textarea
            name="text"
            onChange={this.onChange}
            placeholder="Share a moment here!"
            rows={5}
            value={this.state.text}
            onKeyDown={this.onEnterPress}
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

export default connect(null, {
  requestCreateShare,
})(ShareCreateForm)
