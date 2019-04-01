import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
  Card,
  Media,
  Image,
} from 'components/bulma'
import UserCardButton from './UserCardButton'
import { linkifyText } from 'utils/decorator'
import './UserCard.scss'

class UserCard extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    follow: PropTypes.object.isRequired,
  }

  navigateTo = () => {
    const { user } = this.props

    return this.props.navigateTo(user)
  }

  render() {
    const {
      user,
      defaultImgUrl,
      follow,
      currentUser,
      disableButton,
    } = this.props

    return (
      <Card className="user-card__card">
        <Card.Content className="user-card__card-banner">
          <div style={{ paddingLeft: '80px'}}>
            <p
              className="user-card__name"
              onClick={this.navigateTo}
            >
              {user.name || _.get(user, 'profile.name', user.username)}
            </p>
            <p
              className="user-card__username small"
              onClick={this.navigateTo}
            >
              {user.username}
            </p>
          </div>
        </Card.Content>
        <Media className="user-card__media">
          <Media.Item renderAs="figure" position="left">
            <Image
              className="user-card__user-image"
              onClick={this.navigateTo}
              renderAs="p"
              size={96}
              alt="80x80"
              src={_.get(user, 'profileImgUrl', defaultImgUrl)}
            />
          </Media.Item>
        </Media>
        <Card.Content className="user-card__content">
          <div className="user-card__actions">
            <UserCardButton
              follow={follow}
              user={user}
              currentUser={currentUser}
              disableButton={disableButton}
            />
          </div>

          <p className="user-card__username-text mt-half small">
            {linkifyText(user.description)}
          </p>
        </Card.Content>
      </Card>
    )
  }
}

UserCard.defaultProps = {
  disableButton: false,
}

const mapStateToProps = (state, ownProps) => {
  const { currentUser } = ownProps

  const follow = state.follow[currentUser.username] || {}

  return {
    follow,
  }
}

export default connect(mapStateToProps, {})(UserCard);
