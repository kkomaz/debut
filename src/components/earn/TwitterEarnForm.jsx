/** @jsx jsx */

// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, jsx } from '@emotion/core'
import _ from 'lodash'

// Component Imports
import {
  Control,
  Field,
  Help,
  Input,
  Label,
} from 'components/bulma'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { TwitterMentionButton } from 'react-twitter-embed';

class TwitterEarnForm extends Component {
  state = {
    twitterId: '',
    tweetLink: '',
    btcAddress: '',
    valid: true,
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  onChange = (e) => {
    const { valid } = this.state

    if (!valid) {
      this.setState({ valid: true })
    }
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onCancel = () => {
    this.props.onCancel()
  }

  onSubmit = (e) => {
    e.preventDefault()

    const {
      twitterId,
      tweetLink,
      btcAddress,
    } = this.state

    if (_.isEmpty(twitterId) || _.isEmpty(tweetLink) || _.isEmpty(btcAddress)) {
      this.setState({ valid: false })
    }
  }

  render() {
    const {
      username,
    } = this.props
    const {
      valid,
    } = this.state

    return (
      <React.Fragment>
        <div
          css={css`
            height: 20px;
            width: 61px;
            margin-bottom: 10px;
          `}
        >
          <TwitterMentionButton
            options={{ text: 'Join the debut community and earn some BTC!  More info at', via: 'the_debut_app' }}
          />
        </div>
        <form
          onSubmit={this.onSubmit}
        >
          <Field>
            <Label
              css={css`
                margin-bottom: 0 !important;
              `}
            >
              Blockstack ID
            </Label>
            <p
              css={css`
                font-size: 14px;
              `}
            >
              {username}
            </p>
          </Field>
          <Field>
            <Label>Twitter ID</Label>
            <Control>
              <Input
                css={css`
                  font-size: 14px;
                `}
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
                css={css`
                  font-size: 14px;
                `}
                name="tweetLink"
                placeholder="Tweet Link"
                onChange={this.onChange}
                value={this.state.tweetLink}
              />
          </Field>
          <Field>
            <Label>BTC Address</Label>
              <Input
                css={css`
                  font-size: 14px;
                `}
                name="btcAddress"
                placeholder="BTC Address"
                onChange={this.onChange}
                value={this.state.btcAddress}
              />
          </Field>
          {
            !valid ?
            <Help
              color="danger"
              css={css`
                margin-top: 19px;
                margin-bottom: 19px;
              `}
            >
              No empty fields allowed.
            </Help> :
            <div
              css={css`
                padding-top: 22px;
                padding-bottom: 22px;
            `}>
            </div>
          }
          <SubmitFooter
            onCancel={this.onCancel}
            onSubmit={this.onSubmit}
          />
        </form>
      </React.Fragment>
    )
  }
}

TwitterEarnForm.defaultProps = {
  onCancel: _.noop,
}

export default TwitterEarnForm
