/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { Component } from 'react'
import {
  Card,
  Content,
} from 'components/bulma'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon } from 'components/icon'

class AdminNoShares extends Component {
  state = {
    isPopoverOpen: false
  }

  render() {
    return (
      <Card className="no-shares">
        <Card.Content>
          <Content>
            <div className="no-shares__text-wrapper">
              <Popover
                  isOpen={this.state.isPopoverOpen}
                  position="bottom"
                  padding={30}
                  onClickOutside={() => this.setState({ isPopoverOpen: false })}
                  content={({ position, targetRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={'#383A3F'}
                        arrowSize={10}
                      >
                          <div
                              style={{
                                backgroundColor: '#383A3F',
                                padding: '20px',
                                color: 'white',
                                width: '300px',
                              }}
                              onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                          >
                            <p className="small">
                              Share gives you the ability to express yourself with pictures or just text!  By following other's you can easily see what other people are posting!
                            </p>
                          </div>
                      </ArrowContainer>
                  )}
              >
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconQuestionCircle"
                  onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                  size={16}
                  linkStyles={{
                    position: 'absolute',
                    top: '0',
                    right: '5px',
                    height: '30px'
                  }}
                />
              </Popover>
              <p
                css={css`
                  margin-bottom: 10px !important;
                `}>
                Welcome to debut!  This is your activity feed page!  In this page, you will be able to see real time updates of your shared moments and other's if you follow them
              </p>
              <p
                css={css`
                  margin-bottom: 10px !important;
                `}
              >
                You can view user profiles to the <strong>right</strong> or click the <strong>Explore</strong> to see a list of users!
              </p>
              <p
                css={css`
                  margin-bottom: 10px !important;
                `}
              >
                If you would like to update your profile click on <strong>Profile</strong> above.
              </p>
              <p
                css={css`
                  margin-bottom: 10px !important;
                `}
              >
                You can create your first shared moment with the debut community.  Anyone who follows you will have real time updates on anything you post!
              </p>
            </div>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default AdminNoShares
