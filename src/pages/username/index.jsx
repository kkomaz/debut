// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { lookupProfile } from 'blockstack'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import {
  Button,
  Card,
  Columns,
  Content,
  Heading,
  Image,
  Media,
} from 'components/bulma'

// Component Imports
import { UserContext } from 'components/User/UserProvider'
import { List, UserList } from 'components/icon';
import UserIntroDisplay from 'components/User/IntroDisplay'

// Util/Action Imports
import { fetchUserBlockstackApps, returnFilteredUrls } from 'utils/apps'
import { requestProfileSearch } from 'actions/blockstack'
import toggleNotification from 'utils/notifier/toggleNotification'

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

  async componentDidUpdate(prevProps, prevState) {
    const { username, searchedProfile, history } = this.props
    const { loading } = this.state

    if (prevProps.username !== username) {
      const user = await lookupProfile(username)
      if (user) {
        this.loadUserInfo(user)
      }
    }

    if (prevProps.searchedProfile !== searchedProfile && loading) {
      const apps = _.map((searchedProfile.apps), (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)
      if (!_.includes(filteredDapps, 'https://debutapp_social')) {
        toggleNotification('error', 'User profile is compromised!  Blockstack team is addressing this issue!')
        history.push('/')
      }
    }
  }

  async loadUserInfo(profile) {
    const { userSession } = this.context.state.sessionUser
    const { username, blockstackApps } = this.props
    const options = { decrypt: false, username }

    try {
      const result = await userSession.getFile(`user-intro-${username}.json`, options)

      if (!result) {
        throw new Error('User does not exist')
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
    } catch (e) {
      this.requestProfileSearch()
    }
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

  requestProfileSearch = () => {
    const { username } = this.props
    this.props.requestProfileSearch(username)
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

  navigateAway = () => {
    toggleNotification('error', 'this is an error')
  }

  render() {
    const { userInfo, loading } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state
    const { username, history, searchedProfile } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    const src = _.get(userInfo, 'profile.image[0].contentUrl', defaultImgUrl)

    return (
      <div>
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
                  <List apps={userInfo.apps} />
                </Columns.Column>
                <Columns.Column size={6}>
                  <h4>About Myself</h4>
                  <UserIntroDisplay description={userInfo.description} />
                </Columns.Column>
                <Columns.Column size={6}>
                  <h4>Following</h4>

                  <UserList users={userInfo.following} history={history} />
                </Columns.Column>
              </Columns>
            </Content>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const user = _.find(state.user.users, (user) => user.username === ownProps.username)
  const searchedProfile = _.get(state, 'blockstack.searchedProfile', {})

  return {
    blockstackApps: state.blockstack.apps,
    identityAddress: _.get(user, 'blockstackId'),
    searchedProfile,
  }
}

UsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps, {
  requestProfileSearch,
})(UsernamePage))
