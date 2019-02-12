import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Card,
  Content,
  Heading,
} from 'components/bulma'
import { IconList } from 'components/icon'

class UserDapps extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    userInfo: PropTypes.object.isRequired,
  }

  render() {
    const { userInfo, adminMode } = this.props

    if (!adminMode) {
      return (
        <Card className="user-dapps">
          <Card.Content>
            <Content>
              <Heading size={4}>My Blockstack Dapps</Heading>
                {
                  _.get(userInfo, 'apps.length', 0) > 0 ?
                  <IconList apps={userInfo.apps} /> :
                    <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
                }
            </Content>
          </Card.Content>
        </Card>
      )
    }

    return (
      <Card className="user-dapps">
        <Card.Content>
          <Content>
            <Heading size={4}>My Blockstack Dapps</Heading>
              {
                _.get(userInfo, 'apps.length', 0) > 0 ?
                <IconList apps={userInfo.apps} /> :
                <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
              }

              <Heading size={6}>
                Explore and add other Blockstack Dapps <a href="https://app.co/mining" rel="noopener noreferrer" target="_blank">here!</a>
              </Heading>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default UserDapps
