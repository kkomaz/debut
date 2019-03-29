import React, { Component } from 'react'
import _ from 'lodash'
import {
  Card,
  Media,
  Image,
} from 'components/bulma'
import './UserCard.scss'

class UserCard extends Component {
  navigateTo = () => {
    const { user } = this.props

    return this.props.navigateTo(user)
  }

  render() {
    const { user, defaultImgUrl } = this.props

    return (
      <Card className="user-card__card">
        <Card.Content className="user-card__card-banner" style={{ color: 'white'}}>
          <div style={{ paddingLeft: '80px'}}>
            <p
              className="user-card__name"
              onClick={this.navigateTo}
            >
              {_.get(user, 'profile.name', user.username)}
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
              size={80}
              alt="80x80"
              src={_.get(user, 'profileImgUrl', defaultImgUrl)}
            />
          </Media.Item>
        </Media>
        <Card.Content className="user-card__content">
          <p className="user-card__username-text mt-half small">
            {user.description}
          </p>
        </Card.Content>
      </Card>
    )
  }
}

export default UserCard;
