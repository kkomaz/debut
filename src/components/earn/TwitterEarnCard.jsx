/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  Content,
  Image,
  Modal,
  Section,
} from 'components/bulma'
import twitterEarn from 'assets/twitter_earn.jpg'
import { Icon } from 'components/icon'
import TwitterEarnForm from './TwitterEarnForm'

class TwitterEarnCard extends Component {
  state = {
    showModal: false,
  }

  static propTypes = {
    valid: PropTypes.bool.isRequired,
  }

  openTwitterTask = () => {
    console.log('opening twitter task')
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  render() {
    const { valid } = this.props
    const { showModal } = this.state

    console.log(this.state.showModal)

    return (
      <React.Fragment>
        <Card
          onClick={valid ? this.openModal : _.noop}
          css={css`
            cursor: ${valid ? 'pointer' : 'default'};
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
                <Image
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
                    Twitter <span css={theme => css`color: ${theme.colors.blue}`}>(35%)</span>
                  </h4>
                  <p>
                    Share and tweet about debut.  Invite friends and family.  Get rewarded.
                  </p>
                  <div className="mt-two">
                    <Button
                      color="primary"
                      disabled={!valid}
                      >
                      Begin
                    </Button>
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
              `}
            >
              <TwitterEarnForm />
            </Section>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

export default TwitterEarnCard
