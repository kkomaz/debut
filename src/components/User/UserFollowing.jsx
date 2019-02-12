import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import {
  Card,
  Content,
  Heading,
} from 'components/bulma'
import { UserList } from 'components/icon'

class UserFollowing extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
  }

  render() {
    const { userInfo, history, adminMode } = this.props

    if (!adminMode) {
      return (
        <Card>
          <Card.Content>
            <Content>
              <Heading size={4}>Following Users</Heading>

                {
                  _.get(userInfo, 'following.length', 0) ?
                  <UserList users={userInfo.following} history={history} /> :
                  <Heading size={6}>Not following anyone!</Heading>
                }
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
            {
              _.get(userInfo, 'following.length', 0) ?
              <UserList users={userInfo.following} history={history} /> :
              <Heading size={6}>Add users <Link to="/">here!</Link></Heading>
            }
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default UserFollowing
