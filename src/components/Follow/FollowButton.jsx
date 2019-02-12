import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import './FollowButton.scss'

class FollowButton extends Component {
  static propTypes = {
    sessionUser: PropTypes.object.isRequired,
    setSessionUserState: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  followUser = async () => {
    const { username, setSessionUserState, userInfo, sessionUser, defaultImgUrl } = this.props
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
    const { username, setSessionUserState, sessionUser } = this.props
    const options = { encrypt: false }

    const params = _.filter(sessionUser.following, (user) => {
      return user.username !== username
    })

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  render() {
    const { sessionUser, username } = this.props

    return (
      <React.Fragment>
        {
          sessionUser.username === username ? null :
          _.find(sessionUser.following, (user) => user.username === username) ?
          <Button
            className="follow-button mt-one"
            onClick={this.unfollowUser}
            >
            Unfollow
          </Button> :
          <Button
            className="follow-button mt-one"
            onClick={this.followUser}
            >
            Follow
          </Button>
        }
      </React.Fragment>
    )
  }
}

export default FollowButton
