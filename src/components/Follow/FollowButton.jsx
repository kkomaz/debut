import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import './FollowButton.scss'

class FollowButton extends Component {
  static propTypes = {
    defaultImgUrl: PropTypes.string.isRequired,
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

    try {
      const result = await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

      if (!result) {
        throw new Error('Unable to follow user.')
      }
      setSessionUserState('following', params)
    } catch (e) {
      setSessionUserState('following', sessionUser.following)
    }
  }

  unfollowUser = async () => {
    const { username, setSessionUserState, sessionUser } = this.props
    const options = { encrypt: false }

    const params = _.filter(sessionUser.following, (user) => {
      return user.username !== username
    })

    try {
      const result = await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)
      if (!result) {
        throw new Error('Unable to follow user.')
      }
      setSessionUserState('following', params)
    } catch (e) {
      setSessionUserState('following', sessionUser.following)
    }
  }

  render() {
    const { sessionUser, username } = this.props

    if (_.isEqual(sessionUser.username, username)) {
      return null
    }

    return (
      <React.Fragment>
        {
          _.find(sessionUser.following, (user) => _.isEqual(user.username, username)) ?
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
