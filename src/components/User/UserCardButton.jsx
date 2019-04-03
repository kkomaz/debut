/** @jsx jsx */
import { Component } from 'react'
import { jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button } from 'components/bulma'
import {
  requestFollow,
  requestUnfollow,
} from 'actions/follow'
import UserCardButtonStyles from './UserCardButtonStyles'

class UserCardButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      followingText: 'Following'
    }
  }

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    follow: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    sessionFollow: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    viewedFollow: PropTypes.object.isRequired,
  }

  setUnfollowText = () => {
    this.setState({ followingText: 'Unfollow' })
  }

  setFollowText = () => {
    this.setState({ followingText: 'Following' })
  }

  followUser = async () => {
    const { user, sessionFollow, viewedFollow, currentUser } = this.props
    const following = _.get(sessionFollow, 'following', [])
    const followers = _.get(viewedFollow, 'followers', [])
    this.setState({ followingText: 'Following' })
    this.props.requestFollow(currentUser.username, user.username, following, followers)
  }

  unfollowUser = async () => {
    const { user, sessionFollow, viewdfollow, currentUser } = this.props
    const following = _.get(sessionFollow, 'following', [])
    const followers = _.get(viewdfollow, 'followers', [])
    this.props.requestUnfollow(currentUser.username, user.username, following, followers)
  }

  render() {
    const {
      follow,
      user,
      currentUser,
      loading,
      disableButton,
    } = this.props

    const { followingText } = this.state

    if (currentUser.username === user.username || disableButton) {
      return null
    }

    if (_.includes(follow.following, user.username)) {
      return (
        <Button
          css={theme => UserCardButtonStyles(theme)}
          color={followingText === 'Following' ? 'primary' : 'danger' }
          onMouseEnter={this.setUnfollowText}
          onMouseLeave={this.setFollowText}
          disabled={loading}
          onClick={this.unfollowUser}
        >
          {followingText}
        </Button>
      )
    }

    return (
      <Button
        css={theme => UserCardButtonStyles(theme)}
        onClick={this.followUser}
        disabled={loading}
      >
        Follow
      </Button>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const viewedFollow = state.follow[ownProps.user.username] || {}
  const sessionFollow = state.follow[ownProps.currentUser.username] || {}
  const loading = state.follow.loading

  return {
    viewedFollow,
    sessionFollow,
    loading
  }
}

export default connect(mapStateToProps, {
  requestFollow,
  requestUnfollow,
})(UserCardButton)
