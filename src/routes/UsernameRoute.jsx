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
import { UserHero } from 'components/User'
import FollowingUsers from 'pages/username/following/FollowingUsers'
import FollowersUsers from 'pages/username/followers/FollowersUsers'
import IconProofs from 'components/SocialProofs/IconProofs'

// Util imports
import { appUrl } from 'utils/constants'
import { forceUserSignOut, forceRedirect } from 'utils/auth'
import { requestSingleUser } from 'actions/user'
import { requestFetchFollow } from 'actions/follow'
import { nodeEnv } from 'utils/constants'

class UsernameRoute extends Component {
  state = {
    error: false,
    profile: {},
    loading: true,
    userProofs: []
  }

  static propTypes = {
    dapps: PropTypes.array.isRequired,
    follow: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    shares: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    const { username } = this.props
    // (no data or slim data then make request for full data)
    // if (!user.data || (user.data && !user.data.basicInformation)) {
    //   this.props.requestSingleUser(username)
    // }
    this.props.requestSingleUser(username)
    this.props.requestFetchFollow(username)
  }

  componentDidUpdate(prevProps, prevState) {
    const { username, user } = this.props

    if (username !== prevProps.username) {
      this.props.requestSingleUser(username)
      this.props.requestFetchFollow(username)
      this.setState({ loading: true })
    }

    if (!user.loading && prevProps.user.loading) {
      this.fetchProfileInfo()
    }
  }

  fetchProfileInfo = async () => {
    const { username, history, user } = this.props
    const { sessionUser } = this.context.state
    let profile
    let userProofs

    if (!user.data) {
      return history.push({
        pathname: `/unsigned/${username}`
      })
    }

    try {
      profile = await lookupProfile(username)
      const apps = _.map(profile.apps, (k, v) => {
        return v
      })
      const allowableProofs = ['facebook', 'twitter', 'github', 'linkedIn']
      userProofs = _.filter(profile.account, (account) => _.includes(allowableProofs, account.service))

      if (process.env.NODE_ENV === nodeEnv && (
        _.isEmpty(apps) || (apps.length > 0 && !_.includes(apps, appUrl))
      )) {
        if (sessionUser.username === username) {
          throw new Error("Your gaia hub does not exist!  Log back in and we'll reauthorize you!  Logging out now...")
        } else {
          throw new Error(`${username} is currently using an older version of the Blockstack browser.  They have will have to update to newest version.  Located below are social proofs for ${username}.  Send a ping to let them know to stay up to date!`)
        }
      }
      return this.setState({ profile, loading: false, userProofs })
    } catch (e) {
      // If current user is viewing, redirect
      if (sessionUser !== username) {
        this.setState({ error: true })
        const iconProofs = <IconProofs message={e.message} userProofs={userProofs} username={username} />
        return forceRedirect(history, iconProofs)
      }

      // If current user is the bad user, sign him out
      this.setState({ error: true })
      return forceUserSignOut(sessionUser.userSession, e.message)
    }
  }

  render() {
    const { error, profile, loading, userProofs } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state

    const {
      dapps,
      follow,
      match,
      user,
      shares,
      username,
      history,
    } = this.props

    let lastLocation = null

    if (error) {
      return (
        <div>
          <List />
        </div>
      )
    }

    return (
      <div className="username-route">
        <UserHero
          username={username}
          user={user}
          defaultImgUrl={defaultImgUrl}
          sessionUser={sessionUser}
          userProofs={userProofs}
        />
        <Switch>
          {
            <Route
              exact
              path={match.url}
              render={() => {
                history.listen(location => {
                  lastLocation = location
                })

                const prevHistoryPush = this.props.history.push
                this.props.history.push = (pathname, state = {}) => {
                  if (lastLocation === null ||
                      pathname !== lastLocation.pathname + lastLocation.search + lastLocation.hash ||
                      JSON.stringify(state) !== JSON.stringify(lastLocation.state)
                  ) {
                    prevHistoryPush(pathname, state)
                  }
                }
                return (
                  <UsernamePage
                    user={user}
                    username={username}
                    dapps={dapps}
                    follow={follow}
                    profile={profile}
                    shares={shares}
                    loading={loading}
                    location={lastLocation}
                  />
                )}
              }
            />
          }
          {
            !_.isEmpty(follow) &&
            <Route
              path={`${match.url}/following`}
              render={() => <FollowingUsers follow={follow} />}
            />
          }
          {
            !_.isEmpty(follow) &&
            <Route
              path={`${match.url}/followers`}
              render={() => <FollowersUsers follow={follow} />}
            />
          }
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

  const follow = state.follow[username] || {}

  return {
    user,
    shares,
    follow,
  }
}

export default withRouter(connect(mapStateToProps, {
  requestSingleUser,
  requestFetchFollow,
})(UsernameRoute))
UsernameRoute.contextType = UserContext
