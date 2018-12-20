import React, { Component } from 'react'
import {
  Card,
  Content,
  Media,
  Image,
  Heading,
  Columns,
} from 'react-bulma-components'
import { lookupProfile } from 'blockstack'
import { UserContext } from 'components/User/UserProvider'

class UsernamePage extends Component {
  state = {
    userInfo: { description: '' }
  }
  async componentDidMount() {
    const { username } = this.props
    const user = await lookupProfile(username)
    if (user) {
      this.loadUserInfo(user)
    }
  }

  async loadUserInfo(user) {
    const { userSession } = this.context.state.currentUser
    const { location, username } = this.props
    const options = { decrypt: false }
    const result = await userSession.getFile(`user-intro-${location.state.userAddress}.json`, options)

    this.setState({
      userInfo: {
        description: JSON.parse(result).description,
        contentUrl: user.image[0].contentUrl,
        name: user.name,
        username,
      }
    })
  }

  render() {
    const { userInfo } = this.state

    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image renderAs="p" size={64} alt="64x64" src={userInfo.contentUrl} />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{userInfo.name}</Heading>
              <Heading subtitle size={6}>
                {userInfo.username}
              </Heading>
            </Media.Item>
          </Media>
          <Content>
            <Columns className="mt-one">
              <Columns.Column size={6}>
                1st Half
              </Columns.Column>
              <Columns.Column size={6}>
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
