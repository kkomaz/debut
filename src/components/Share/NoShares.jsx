import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Content,
} from 'components/bulma'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon } from 'components/icon'

class NoShares extends Component {
  state = {
    isPopoverOpen: false
  }
  render() {
    const { username } = this.props

    return (
      <Card className="no-shares">
        <Card.Content>
          <Content>
            <div className="no-shares__text-wrapper">
              <Popover
                  isOpen={this.state.isPopoverOpen}
                  position="right"
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
                              Share gives you the ability to express yourself with pictures or just text!  Let others know you feel!
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
              <p>{username} is not sharing any moments at this time!</p>
            </div>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

NoShares.propTypes = {
  username: PropTypes.string.isRequired,
}

export default NoShares
