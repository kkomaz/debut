import React, { Component } from 'react'
import {
  Card,
  Content,
} from 'components/bulma'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon } from 'components/icon'

class AdminNoFollowers extends Component {
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
                              By being followed, others will know when you post a moment!
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
              <p>You are not being followed at this moment.  Add some information about yourself and interact with others!</p>
            </div>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default AdminNoFollowers
