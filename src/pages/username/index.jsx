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
import UserList from 'components/icon/UserList'
import { withRouter } from 'react-router-dom'

class UsernamePage extends Component {
  state = {
    loading: true
  }

  static propTypes = {
    blockstackApps: PropTypes.array.isRequired,
  }

  async componentDidMount() {
    console.log('did mount')
    const { username } = this.props
    const user = await lookupProfile(username)
    if (user) {
      this.loadUserInfo(user)
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log('did update')
    const { username } = this.props

    if (prevProps.username !== username) {
      const user = await lookupProfile(username)
      if (user) {
        this.loadUserInfo(user)
      }
    }
  }

  async loadUserInfo(profile) {
    const { userSession } = this.context.state.sessionUser
    const { username, blockstackApps, identityAddress } = this.props
    const options = { decrypt: false, username }
    let result

    result = await userSession.getFile(`user-intro-${username}.json`, options)

    if (!result) {
      result = await userSession.getFile(`user-intro-${identityAddress}.json`, options)
    }

    const apps = _.map((profile.apps), (k,v) => {
      return v
    })

    const filteredDapps = returnFilteredUrls(apps)

    const userDapps = await fetchUserBlockstackApps(blockstackApps, filteredDapps)
    const following = await userSession.getFile(`users-following-${username}.json`, options)

    this.setState({
      userInfo: {
        description: JSON.parse(result).description,
        profile,
        username,
        apps: userDapps,
        following: JSON.parse(following)
      },
      loading: false
    })
  }

  followUser = async () => {
    const { username } = this.props
    const { sessionUser, defaultImgUrl } = this.context.state
    const { setSessionUserState } = this.context
    const { userInfo } = this.state

    const options = { encrypt: false }
    const user = {
      username,
      imageUrl: _.get(userInfo, 'profile.image[0].contentUrl', defaultImgUrl)
    }

    const params = [...sessionUser.following, user]

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  unfollowUser = async () => {
    const { username } = this.props
    const { sessionUser } = this.context.state
    const { setSessionUserState } = this.context
    const options = { encrypt: false }

    const params = _.filter(sessionUser.following, (user) => {
      return user.username !== username
    })

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  render() {
    const { userInfo, loading } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state
    const { username, history } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    const src = _.get(userInfo, 'profile.image[0].contentUrl', defaultImgUrl)

    return (
      <Card className="username-page">
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
            </Media.Item>
          </Media>
          <Content>
            {
              sessionUser.username === username ? null :
              _.find(sessionUser.following, (user) => user.username === username) ?
              <Button
                className="mt-one"
                onClick={this.unfollowUser}
                >
                Unfollow
              </Button> :
              <Button
                className="mt-one"
                onClick={this.followUser}
                >
                Follow
              </Button>
            }
            <Columns className="mt-one">
              <Columns.Column size={6}>
                <h4>My Apps</h4>
                <IconList apps={userInfo.apps} />
              </Columns.Column>
              <Columns.Column size={6}>
                <h4>About Myself</h4>
                {userInfo.description}
              </Columns.Column>
              <Columns.Column size={6}>
                <h4>Following</h4>

                <UserList users={userInfo.following} history={history} />
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const user = _.find(state.user.users, (user) => user.username === ownProps.username)

  return {
    blockstackApps: state.blockstack.apps,
    identityAddress: _.get(user, 'blockstackId')
  }
}

UsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps)(UsernamePage))
