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

class UserDapps extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    userInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  render() {
    const { userInfo, adminMode, loading } = this.props

    if (!adminMode) {
      return (
        <Card className="user-dapps">
          <Card.Content>
            <Content>
              <Loadable loading={loading}>
                <Heading size={4}>My Blockstack Dapps</Heading>
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
                <Heading size={4}>My Blockstack Dapps</Heading>
                {
                  _.get(userInfo, 'dapps.length', 0) > 0 ? <IconList dapps={userInfo.dapps} /> :
                  <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
                }
                <p className="small">
                  New to Blockstack?  To have your decentralized apps show up,
                  you can add them by signing into different applications!
                </p>
                <p className="small">
                  The list of blockstack apps are located <a href="https://app.co/blockstack" rel="noopener noreferrer" target="_blank">here!  </a>
                  Keep in mind it will take some time for your apps to show up in debut but rest assured it will arrive!
                </p>
              </React.Fragment>
            </Loadable>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

export default UserDapps
