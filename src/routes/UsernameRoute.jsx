// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash';
import { lookupProfile } from 'blockstack'
import { withRouter } from 'react-router-dom'
import { List } from 'react-content-loader'

// Component Imports
import UsernamePage from 'pages/username/UsernamePage'
import { UserContext } from 'components/User/UserProvider'
import { HeroAvatarLoader } from 'components/Loader'
import { AvatarForm } from 'components/User'
import FollowButton from 'components/Follow/FollowButton'
import { UserTabs } from 'components/Tab'
import {
  Container,
  Columns,
  Heading,
  Media,
} from 'components/bulma'

// Util imports
import { appUrl } from 'utils/constants'
import toggleNotification from 'utils/notifier/toggleNotification'
import { forceUserSignOut, forceRedirect } from 'utils/auth'

class UsernameRoute extends Component {
  state = {
    error: false,
    profile: {},
  }

  static propTypes = {
    dapps: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    shares: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  componentDidUpdate(prevProps, prevState) {
    const { username, user } = this.props

    if (username !== prevProps.username) {
      this.fetchProfileInfo()
    }

    if (!user.loading && prevProps.user.loading) {
      this.fetchProfileInfo()
    }
  }

  fetchProfileInfo = async () => {
    const { username, history, user } = this.props
    const { sessionUser } = this.context.state

    if (!user.data) {
      return history.push({
        pathname: `/unsigned/${username}`
      })
    }

    try {
      const profile = await lookupProfile(username)
      const apps = _.map(profile.apps, (k, v) => {
        return v
      })

      if (process.env.NODE_ENV === 'development' && (
        !apps || (apps.length > 0 && !_.includes(apps, appUrl))
      )) {
        if (sessionUser.username === username) {
          throw new Error("Your gaia hub does not exist!  Log back in and we'll reauthorize you!  Logging out now...")
        } else {
          throw new Error("This user is currently using an older version of the Blockstack browser.  They have will have to relog back in with the most up to date.  Redirecting back to the main page!")
        }
      }
      return this.setState({ profile })
    } catch (e) {
      // If current user is viewing, redirect
      if (sessionUser !== username) {
        toggleNotification('warning', e.message)
        this.setState({ error: true })
        return forceRedirect(history)
      }

      // If current user is the bad user, sign him out
      this.setState({ error: true })
      return forceUserSignOut(sessionUser.userSession, e.message)
    }
  }

  render() {
    const { error, profile } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state

    const {
      dapps,
      match,
      user,
      shares,
      username,
    } = this.props

    if (error) {
      return (
        <div>
          <List />
        </div>
      )
    }

    return (
      <div className="username-route">
        <Container>
          <Columns>
            <Columns.Column size={12} style={{ paddingBottom: '0' }}>
              <Media className="username__hero">
                <Media.Item renderAs="figure" position="left">
                  {
                    (user.loading || user.avatarLoading) ?
                    <HeroAvatarLoader /> :
                    <AvatarForm
                      user={user}
                      defaultImgUrl={defaultImgUrl}
                      sessionUser={sessionUser}
                    />
                  }
                </Media.Item>
                <Media.Item
                  position="center"
                  style={{ alignSelf: 'center' }}
                >
                  <Heading size={4} style={{ color: 'white' }}>{_.get(user, 'data.profile.name', username)}</Heading>
                  <Heading subtitle size={6} style={{ color: 'white' }}>
                    {username}
                  </Heading>
                  <FollowButton
                    defaultImgUrl={defaultImgUrl}
                    sessionUser={sessionUser}
                    user={user}
                    username={username}
                  />
                </Media.Item>
              </Media>
            </Columns.Column>
            <Columns.Column size={12} style={{ paddingTop: '0' }}>
              <UserTabs username={username} />
            </Columns.Column>
          </Columns>
        </Container>
        <Switch>
          <Route
            exact
            path={match.url}
            render={() =>
              <UsernamePage
                user={user}
                username={username}
                dapps={dapps}
                profile={profile}
                shares={shares}
              />
            }
          />
          <Route
            path={`${match.url}/following`}
            render={() => <div>Hello following</div>}
          />
          <Route
            path={`${match.url}/followers`}
            render={() => <div>Hello followers</div>}
          />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps
  const { share } = state

  const user = {
    data: _.find(state.user.users, (user) => user._id === username),
    loading: state.user.loading,
    avatarLoading: state.user.avatarLoading
  }

  const shares = {
    list: _.filter(state.share.shares.list, (share) => share.username === username),
    full: share.shares.full,
    loading: share.shares.loading
  }

  return {
    user,
    shares,
  }
}

export default withRouter(connect(mapStateToProps)(UsernameRoute))
UsernameRoute.contextType = UserContext
