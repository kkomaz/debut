import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Card,
  Content,
  Heading,
} from 'components/bulma'
import { IconList } from 'components/icon'
import { Loadable } from 'components/Loader'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon } from 'components/icon'
import './UserDapps.scss'

class UserDapps extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    userInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  state = {
    isPopoverOpen: false,
  }

  render() {
    const { userInfo, adminMode, loading } = this.props

    if (!adminMode) {
      return (
        <Card className="user-dapps">
          <Card.Content>
            <Content>
              <Loadable loading={loading}>
                <div className="user-dapps__info-section">
                  <Heading className="mr-one" size={4}>My Blockstack Dapps</Heading>
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
                                    New to Blockstack?  To have your decentralized apps show up,
                                    you can add them by signing into different applications!
                                  </p>
                                  <p className="small">
                                    The list of blockstack apps are located <a style={{ color: '#518DCA'}}href="https://app.co/blockstack" rel="noopener noreferrer" target="_blank">here!  </a>
                                  Keep in mind it will take some time for your apps to show up in debut but rest assured it will arrive!
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
                      />
                    </Popover>
                </div>
                {
                  _.get(userInfo, 'dapps.length', 0) > 0 ?
                  <IconList dapps={userInfo.dapps} /> :
                  <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
                }
              </Loadable>
            </Content>
          </Card.Content>
        </Card>
      )
    }

    return (
      <Card className="user-dapps">
        <Card.Content>
          <Content>
            <Loadable loading={loading}>
              <React.Fragment>
                <div className="user-dapps__info-section">
                  <Heading className="mr-one" size={4}>My Blockstack Dapps</Heading>
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
                                    New to Blockstack?  To have your decentralized apps show up,
                                    you can add them by signing into different applications!
                                  </p>
                                  <p className="small">
                                    The list of blockstack apps are located <a style={{ color: '#518DCA'}}href="https://app.co/blockstack" rel="noopener noreferrer" target="_blank">here!  </a>
                                  Keep in mind it will take some time for your apps to show up in debut but rest assured it will arrive!
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
                      />
                    </Popover>
                </div>
                {
                  _.get(userInfo, 'dapps.length', 0) > 0 ? <IconList dapps={userInfo.dapps} /> :
                  <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
                }
              </React.Fragment>
            </Loadable>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default UserDapps
