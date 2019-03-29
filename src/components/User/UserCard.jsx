import React, { Component } from 'react'
import _ from 'lodash'
import {
  Button,
  Card,
  Media,
  Image,
} from 'components/bulma'
import './UserCard.scss'

class UserCard extends Component {
  render() {
    const { user, defaultImgUrl } = this.props
    return (
      <Card className="user-card__card" onClick={() => this.props.navigateTo(user)}>
        <Card.Content className="user-card__card-banner">
        </Card.Content>
        <Media className="user-card__media">
          <Media.Item renderAs="figure" position="left">
            <Image
              className="user-card__user-image"
              renderAs="p"
              size={64}
              alt="64x64"
              src={_.get(user, 'profileImgUrl', defaultImgUrl)}
            />
          </Media.Item>
          <Media.Item className="user-card__user-identification">
            <p className="user-card__name" size={6}>{`@${user.username}`}</p>
          </Media.Item>
        </Media>
        <Card.Content className="user-card__content">
          <Button color="primary">Follow</Button>
          <p className="user-card__username-text mt-half small">
            {user.description}
          </p>
        </Card.Content>
      </Card>
    )
  }
}

export default UserCard;
