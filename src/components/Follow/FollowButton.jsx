import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import { connect } from 'react-redux'
import {
  requestFollow,
  requestUnfollow,
} from 'actions/follow'
import './FollowButton.scss'

class FollowButton extends Component {
  static propTypes = {
    defaultImgUrl: PropTypes.string.isRequired,
    sessionUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  followUser = async () => {
    const { username, sessionFollow, viewedfollow, sessionUser } = this.props
    const following = _.get(sessionFollow, 'following', [])
    const followers = _.get(viewedfollow, 'followers', [])
    this.props.requestFollow(sessionUser.username, username, following, followers)
  }

  unfollowUser = async () => {
    const { username, sessionFollow, viewedFollow, sessionUser } = this.props
    const following = _.get(sessionFollow, 'following', [])
    const followers = _.get(viewedFollow, 'followers', [])
    this.props.requestUnfollow(sessionUser.username, username, following, followers)
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
  requestUnfollow,
})(FollowButton)
