import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Card from 'react-bulma-components/lib/components/card'
import Columns from 'react-bulma-components/lib/components/columns'
import Content from 'react-bulma-components/lib/components/content'
import Media from 'react-bulma-components/lib/components/media'
import Image from 'react-bulma-components/lib/components/image'
import Heading from 'react-bulma-components/lib/components/heading'
import Button from 'react-bulma-components/lib/components/button'
import _ from 'lodash'
import { lookupProfile } from 'blockstack'
import { UserContext } from 'components/User/UserProvider'
import { fetchUserBlockstackApps, returnFilteredUrls } from 'utils/apps'
import IconList from 'components/icon/List'

class UsernamePage extends Component {
  state = {
    loading: true
  }

  static propTypes = {
    blockstackApps: PropTypes.array.isRequired,
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
    const { location, username, blockstackApps } = this.props
    const options = { decrypt: false, username }
    const result = await userSession.getFile(`user-intro-${location.state.identityAddress}.json`, options)
    const apps = _.map((profile.apps), (k,v) => {
      return v
    })

    const filteredDapps = returnFilteredUrls(apps)

    const userDapps = await fetchUserBlockstackApps(blockstackApps, filteredDapps)

    this.setState({
      userInfo: {
        description: JSON.parse(result).description,
        profile,
        username,
        apps: userDapps,
      },
      loading: false
    })
  }

  followUser = async () => {
    const { username } = this.props
    const { sessionUser } = this.context.state
    const { setSessionUserState } = this.context
    const options = { encrypt: false }

    const params = [...sessionUser.following, username]

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  unfollowUser = async () => {
    const { username } = this.props
    const { sessionUser } = this.context.state
    const { setSessionUserState } = this.context
    const options = { encrypt: false }

    const params = _.filter(sessionUser.following, (user) => {
      return user !== username
    })

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  render() {
    const { userInfo, loading } = this.state
    const { sessionUser } = this.context.state
    const { username } = this.props

    console.log(sessionUser)

    if (loading) {
      return <div>Loading...</div>
    }

    const src = _.get(userInfo, 'profile.image[0].contentUrl', 'https://i.imgur.com/w1ur3Lq.jpg')

    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image style={{ margin: 0 }} renderAs="p" size={64} alt="64x64" src={src} />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{userInfo.profile.name}</Heading>
              <Heading subtitle size={6}>
                {userInfo.username}
              </Heading>
              {
                _.includes(sessionUser.following, username) ?
                <Button
                  onClick={this.unfollowUser}
                >
                  Unfollow
                </Button> :
                <Button
                  onClick={this.followUser}
                >
                  Follow
                </Button>
              }
            </Media.Item>
          </Media>
          <Content>
            <Columns className="mt-one">
              <Columns.Column size={6}>
                <h4>My Apps</h4>
                <IconList apps={userInfo.apps} />
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

const mapStateToProps = (state) => {
  return {
    blockstackApps: state.blockstack.apps
  }
}

UsernamePage.contextType = UserContext
export default connect(mapStateToProps)(UsernamePage)
