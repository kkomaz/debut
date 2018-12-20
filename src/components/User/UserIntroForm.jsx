import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Field,
  Label,
  Textarea,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'

class UserIntroForm extends Component {
  constructor(props) {
    super(props)

    const { description } = props

    this.state = {
      description,
    }
  }

  static propTypes = {
    description: PropTypes.string,
    fileExists: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
    userAddress: PropTypes.string.isRequired,
    userSession: PropTypes.object.isRequired,
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onCancel = (e) => {
    e.preventDefault()
    console.log('canceling')
  }

  onSubmit = async (e) => {
    const { description } = this.state
    const { fileExists } = this.props
    e.preventDefault()

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
    const { userSession, userAddress, username } = this.props

    await userSession.putFile(`user-intro-${userAddress}.json`, JSON.stringify({ description }), options)
    await axios.post('https://debut-3fcee.firebaseio.com/user.json', { description, blockstackId: userAddress, username })
  }

  async editUserIndexer() {
    const options = { encrypt: false }
    const { description } = this.state
    const { userSession, userAddress, username } = this.props

    await userSession.putFile(`user-intro-${userAddress}.json`, JSON.stringify({ description }), options)
    await axios.post('https://debut-3fcee.firebaseio.com/users.json', { description, blockstackId: userAddress, username })
  }

  render() {
    return (
      <form className="user-intro-form" onSubmit={this.onSubmit}>
        <Field>
          <Label>Introduction</Label>
          <Textarea
            name="description"
            onChange={this.onChange}
            placeholder="Add description here!"
            rows={20}
            value={this.state.description}
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

UserIntroForm.defaultProps = {
  description: '',
  onSubmit: _.noop
}

export default UserIntroForm
