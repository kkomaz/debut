import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import classNames from 'classnames';
import {
  Field,
  Textarea,
  Help,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { requestCreateShare } from 'actions/share'
import './ShareCreateForm.scss'

class ShareCreateForm extends Component {
  state = {
    text: '',
    characterLength: 0,
    valid: true,
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }

  onChange = (e) => {
    const { valid } = this.props

    if (!valid) {
      this.setState({ valid: true })
    }

    this.setState({
      [e.target.name]: e.target.value,
      characterLength: e.target.value.length
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()

    const { text } = this.state
    const { username } = this.props

    if (_.isEmpty(text)) {
      return this.setState({ valid: false })
    }

    const params = {
      text,
      username,
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
    const { characterLength, valid } = this.state
    const leftoverLength = 150 - characterLength
    const characterClass = classNames({
      'share-create-form__character-length': true,
      'share-create-form__character-length--warning': leftoverLength < 100 && leftoverLength >= 30,
      'share-create-form__character-length--danger': leftoverLength < 30
    })
    return (
      <form
        ref={(shareForm) => this.shareForm = shareForm}
        className="share-create-form"
        onSubmit={this.onSubmit}
      >
        <Field>
          <Textarea
            name="text"
            onChange={this.onChange}
            placeholder="Share a moment here!"
            rows={2}
            value={this.state.text}
            onKeyDown={this.onEnterPress}
            maxLength={150}
            color={valid ? null : 'danger'}
          />
          {
            !valid && <Help color="danger">Field can not be empty!</Help>
          }
        </Field>
        <div className="share-create-form__submit-wrapper">
          <p className={characterClass}>{150 - this.state.characterLength} characters left</p>

          <SubmitFooter
            onCancel={this.onCancel}
            onSubmit={this.onSubmit}
          />
        </div>
      </form>
    )
  }
}

export default connect(null, {
  requestCreateShare,
})(ShareCreateForm)
