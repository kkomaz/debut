import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import { connect } from 'react-redux'
import { requestFollow, requestFetchFollow} from 'actions/follow'
import './FollowButton.scss'

class FollowButton extends Component {
  static propTypes = {
    defaultImgUrl: PropTypes.string.isRequired,
    sessionUser: PropTypes.object.isRequired,
    setSessionUserState: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  componentDidMount = async () => {
    const { username } = this.props

    this.props.requestFetchFollow(username)
  }

  followUser = async () => {
    const { username, sessionFollow, sessionUser } = this.props
    const following = _.get(sessionFollow, `following`, [])
    this.props.requestFollow(sessionUser.username, username, following)
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
    const { sessionUser, sessionFollow, username } = this.props

    if (_.isEqual(sessionUser.username, username)) {
      return null
    }

    return (
      <React.Fragment>
        {
          _.includes(sessionFollow.following, username) ?
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

const mapStateToProps = (state, ownProps) => {
  const viewedfollow = state.follow[ownProps.username] || {}
  const sessionFollow = state.follow[ownProps.sessionUser.username] || {}

  return {
    viewedfollow,
    sessionFollow
  }
}

export default connect(mapStateToProps, {
  requestFollow,
  requestFetchFollow,
})(FollowButton)
