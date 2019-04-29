/** @jsx jsx */

// Library Imports
import { css, jsx } from '@emotion/core'
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  Columns,
  Content,
  Modal,
  ModalHeader,
  Section,
} from 'components/bulma'
import moment from 'moment'

// Component Imports
import { Icon } from 'components/icon'
import TwitterEarnForm from './TwitterEarnForm'
import TwitterEarnGuidelines from './TwitterEarnGuidelines'

// Util Imports
import twitterEarn from 'assets/twitter_earn.jpg'
import tweetFormImg from 'assets/tweet_1.jpg'

class TwitterEarnCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      showTwitterForm: false,
    }
  }

  static propTypes = {
    valid: PropTypes.bool.isRequired,
    sessionUser: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
  }

  onCancel = () => {
    this.showTwitterFormFalse()
    this.closeModal()
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  showTwitterFormTrue = () => {
    this.setState({ showTwitterForm: true })
  }

  showTwitterFormFalse = () => {
    this.setState({ showTwitterForm: false })
  }

  isValid = () => {
    const { valid, task } = this.props
    const currentMonth = moment().month()

    if (currentMonth === 3) {
      return false
    }

    return valid && _.isEmpty(task)
  }

  isStartDisabled = () => {
    const { valid } = this.props

    const currentMonth = moment().month()

    if (currentMonth === 3) {
      return true
    }

    return !valid
  }

  addDefaultSrc = (evt) => {
    evt.target.src = 'https://i.imgur.com/w1ur3Lq.jpg'
  }

  render() {
    const { sessionUser, task } = this.props
    const { showModal, showTwitterForm } = this.state

    return (
      <React.Fragment>
        <Card
          onClick={this.isValid() ? this.openModal : _.noop}
          css={css`
            cursor: ${this.isValid() ? 'pointer' : 'default'};
            &:hover {
              box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 24px;
            }
          `}
        >
          <Card.Content
            css={css`
              padding-top: 0;
              padding-bottom: 0;
              padding-left: 0;
            `}
          >
            <Content>
              <div
                css={css`
                  display: flex;
                `}
              >
                <div
                  style={{
                    backgroundImage: `url(${twitterEarn})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50% 50%',
                    margin: 0,
                    height: '264px',
                    width: '50%',
                  }}
                />
                <div
                  css={css`
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    padding: 24px;
                  `}
                >
                  <Icon
                    className="debut-icon"
                    icon="IconTwitter"
                    size={32}
                    color="#00acee"
                  />
                  <h4 className="mt-one">
                    Twitter <span css={theme => css`color: ${theme.colors.blue}`}>(30%)</span>
                  </h4>
                  <p>
                    Share and tweet about debut.  Invite friends and family.  Get rewarded.
                  </p>
                  <div className="mt-two">
                    {
                      this.isValid() ?
                      <Button
                        color="primary"
                        disabled={this.isStartDisabled}
                        >
                        Begin
                      </Button> :
                      <Button
                        color="primary"
                        disabled
                      >
                        {
                          task ?
                          'Completed' :
                          'Incomplete'
                        }
                      </Button>
                    }
                  </div>
                </div>
              </div>
            </Content>
          </Card.Content>
        </Card>
        <Modal
          show={showModal}
          onClose={this.closeModal}
          closeOnEsc
        >
          <Modal.Content>
            <Section
              css={css`
                background-color: white;
                padding-top: 0;
              `}
            >
              <ModalHeader
                headerText="Tweet and Share"
                closeModal={this.closeModal}
              />
              <Columns className="mt-half">
                <Columns.Column size={6}>
                  <div
                    css={css`
                      background-image: url(${tweetFormImg});
                      background-size: cover;
                      background-repeat: no-repeat;
                      background-position: 50% 50%;
                      margin: 0;
                      height: 100%;
                      width: 100%;

                      @media only screen and (max-width: 769px) {
                        height: 200px;
                      }
                    `}
                  />
                </Columns.Column>
                <Columns.Column
                  css={css`
                    position: relative;
                  `}
                  size={6}
                >
                  {
                    showTwitterForm ?
                    <React.Fragment>
                      <Button
                        onClick={this.showTwitterFormFalse}
                        color="light"
                        css={css`
                          position: absolute;
                          bottom: 13px;
                          left: 12px;
                        `}
                      >
                        Back
                      </Button>
                      <TwitterEarnForm
                        username={sessionUser.username}
                        onCancel={this.onCancel}
                        onComplete={this.onCancel}
                      />
                    </React.Fragment>
                    :
                    <TwitterEarnGuidelines
                      onDecline={this.closeModal}
                      onAccept={this.showTwitterFormTrue}
                    />
                  }
                </Columns.Column>
              </Columns>
            </Section>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

export default TwitterEarnCard
