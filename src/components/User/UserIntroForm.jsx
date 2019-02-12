import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Field,
  Label,
  Textarea,
  Help,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'

class UserIntroForm extends Component {
  constructor(props) {
    super(props)

    const { description } = props

    this.state = {
      description,
      valid: true,
    }
  }

  static propTypes = {
    description: PropTypes.string,
    fileExists: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    identityAddress: PropTypes.string.isRequired,
    userSession: PropTypes.object.isRequired,
  }

  onChange = (e) => {
    const { valid } = this.props

    if (!valid) {
      this.setState({ valid: true })
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onCancel = (e) => {
    e.preventDefault()
    this.props.onCancel()
  }

  onSubmit = async (e) => {
    const { description } = this.state
    const { fileExists } = this.props
    e.preventDefault()

    if (_.isEmpty(description)) {
      return this.setState({ valid: false })
    }

    try {
      fileExists ? this.editUserIndexer() : this.createUserIndexer()
      this.props.onSubmit({ description })
    } catch (e) {
      console.log(e.message)
    }
  }

  async createUserIndexer() {
    const options = { encrypt: false }
    const { description } = this.state
    const {
      userSession,
      identityAddress,
      username
    } = this.props

    const result = await axios.post('/users.json', { blockstackId: identityAddress, username })

    const blockstackData = {
      description,
      firebaseId: result.data.name
    }
    await userSession.putFile(`user-intro-${username}.json`, JSON.stringify(blockstackData), options)
  }

  async editUserIndexer() {
    const options = { encrypt: false }
    const { description } = this.state
    const {
      userSession,
      username,
    } = this.props

    const blockstackData = {
      description,
    }
    await userSession.putFile(`user-intro-${username}.json`, JSON.stringify(blockstackData), options)
  }

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmit(e)
    }
  }

  render() {
    const { valid } = this.state

    return (
      <form className="user-intro-form" onSubmit={this.onSubmit}>
        <Field>
          <Label>Introduction</Label>
          <Textarea
            name="description"
            onChange={this.onChange}
            placeholder="Add description here!"
            rows={20}
            onKeyDown={this.onEnterPress}
            value={this.state.description}
            color={valid ? null : 'danger'}
          />
          {
            !valid && <Help color="danger">Field can not be empty!</Help>
          }
        </Field>
        <SubmitFooter
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      </form>
    )
  }
}

UserIntroForm.defaultProps = {
  description: '',
  onSubmit: _.noop,
  onCancel: _.noop,
}

export default UserIntroForm
