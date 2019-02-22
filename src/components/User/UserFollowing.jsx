import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import {
  Card,
  Content,
  Heading,
} from 'components/bulma'
import { UserList, Icon } from 'components/icon'
import { Loadable } from 'components/Loader'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import './UserFollowing.scss'

class UserFollowing extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    userInfo: PropTypes.object.isRequired,
  }

  state = {
    isPopoverOpen: false
  }

  render() {
    const { userInfo, history, adminMode, loading } = this.props

    if (!adminMode) {
      return (
        <Card className="user-following">
          <Card.Content>
            <Content>
              <div className="user-following__info-section">
                <Heading className="mr-one" size={4}>Following Users</Heading>
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
                                    width: '300px'
                                  }}
                                  onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                              >
                                <p className="small">
                                  By following other debut users, you can quickly go to profiles and get updates about their moments!
                                  Click on the follow button next to their profile image to follow a user!.  You can view users via home
                                  <strong><Link style={{ color: '#518DCA' }} to="/"> page!</Link></strong>
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
              <Loadable loading={loading}>
                {
                  _.get(userInfo, 'following.length', 0) ?
                  <UserList users={userInfo.following} history={history} /> :
                  <Heading size={6}>Not following anyone!</Heading>
                }
              </Loadable>
            </Content>
          </Card.Content>
        </Card>
      )
    }

    return (
      <Card className="user-following">
        <Card.Content>
          <Content>
            <Heading size={4}>Following Users</Heading>
            <div className="user-following__info-section">
              <Heading className="mr-one" size={4}>Following Users</Heading>
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
                                  width: '300px'
                                }}
                                onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                            >
                              <p className="small">
                                By following other debut users, you can quickly go to profiles and get updates about their moments!
                                Click on the follow button next to their profile image to follow a user!.  You can view users via home
                                <strong><Link style={{ color: '#518DCA' }} to="/"> page!</Link></strong>
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
            <Loadable loading={loading}>
              {
                _.get(userInfo, 'following.length', 0) ?
                <UserList users={userInfo.following} history={history} /> :
                <div>
                  <Heading size={6}>Not following anyone!</Heading>
                </div>
              }
            </Loadable>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default UserFollowing
