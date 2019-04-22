// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

// Component Imports
import {
  Control,
  Field,
  Input,
  Label,
} from 'components/bulma'
import SubmitFooter from 'components/UI/Form/SubmitFooter'

class TwitterEarnForm extends Component {
  state = {
    twitterId: '',
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onCancel = () => {
    this.props.onCancel()
  }

  onSubmit = () => {
    console.log('submitting')
  }

  render() {
    return (
      <form
        onSubmit={this.onSubmit}
      >
        <Field>
          <Label>Twitter ID</Label>
          <Control>
            <Input
              name="twitterId"
              placeholder="Twitter ID"
              onChange={this.onChange}
              value={this.state.twitterId}
            />
          </Control>
        </Field>
        <Field>
          <Label>Tweet Link</Label>
            <Input
              name="tweetLink"
              placeholder="Tweet Link"
              onChange={this.onChange}
              value={this.state.tweetLink}
            />
        </Field>
        <Field>
          <Label>BTC Address</Label>
            <Input
              name="btcAddress"
              placeholder="BTC Address"
              onChange={this.onChange}
              value={this.state.btcAddress}
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

TwitterEarnForm.defaultProps = {
  onCancel: _.noop,
}

export default TwitterEarnForm
