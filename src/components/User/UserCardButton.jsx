import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Button,
} from 'components/bulma'
import './UserCardButton.scss'

class UserCardButton extends Component {
  constructor(props) {
    super(props)

    const { follow, user } = props

    this.state = {
      followingText: _.includes(follow.following, user.username) ? 'Following' : ''
    }
  }

  static propTypes = {
    follow: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  setUnfollowText = () => {
    this.setState({ followingText: 'Unfollow' })
  }

  setFollowText = () => {
    this.setState({ followingText: 'Following' })
  }

  render() {
    const { follow, user, currentUser } = this.props
    const { followingText } = this.state

    if (currentUser.username === user.username) {
      return null
    }

    if (_.includes(follow.following, user.username)) {
      return (
        <Button
          className="user-card-button"
          color={followingText === 'Following' ? 'primary' : 'danger' }
          onMouseEnter={this.setUnfollowText}
          onMouseLeave={this.setFollowText}
        >
          {followingText}
        </Button>
      )
    }

    return (
      <Button
        className="user-card-button"
      >
        Follow
      </Button>
    )
  }
}

export default UserCardButton
