import React, { Component } from 'react'
import {
  Card,
  Content,
  Media,
  Image,
  Heading,
  Columns,
} from 'react-bulma-components'
import _ from 'lodash'
import { lookupProfile } from 'blockstack'
import { UserContext } from 'components/User/UserProvider'

class UsernamePage extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    const { username } = this.props
    const user = await lookupProfile(username)
    if (user) {
      this.loadUserInfo(user)
    }
  }

  async loadUserInfo(profile) {
    const { userSession } = this.context.state.sessionUser
    const { location, username } = this.props
    const options = { decrypt: false }
    const result = await userSession.getFile(`user-intro-${location.state.identityAddress}.json`, options)
    const apps = _.map((profile.apps), (k,v) => {
      return v
    })

    this.setState({
      userInfo: {
        description: JSON.parse(result).description,
        profile,
        username,
        apps
      },
      loading: false
    })
  }

  render() {
    const { userInfo, loading } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image renderAs="p" size={64} alt="64x64" src={userInfo.profile.image[0].contentUrl} />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{userInfo.profile.name}</Heading>
              <Heading subtitle size={6}>
                {userInfo.username}
              </Heading>
            </Media.Item>
          </Media>
          <Content>
            <Columns className="mt-one">
              <Columns.Column size={6}>
                <h4>My Apps</h4>
                  <ul>
                    {
                      _.map((userInfo.apps), (app) => {
                        return <li>{app}</li>
                      })
                    }
                  </ul>
              </Columns.Column>
              <Columns.Column size={6}>
                <h4>About Myself</h4>
                {userInfo.description}
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

UsernamePage.contextType = UserContext
export default UsernamePage
