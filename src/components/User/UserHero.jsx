import React, { Component } from 'react'
import _ from 'lodash'
import {
  Container,
  Columns,
  Heading,
  Media,
} from 'components/bulma'
import FollowButton from 'components/Follow/FollowButton'
import { UserTabs } from 'components/Tab'
import { HeroAvatarLoader } from 'components/Loader'
import { AvatarForm } from 'components/User'

class UserHero extends Component {
  render() {
    const { username, user, defaultImgUrl, sessionUser } = this.props

    return (
      <Container>
        <Columns>
          <Columns.Column size={12} style={{ paddingBottom: '0' }}>
            <Media className="username__hero">
              <Media.Item renderAs="figure" position="left">
                {
                  (user.loading || user.avatarLoading) ?
                  <HeroAvatarLoader /> :
                  <AvatarForm
                    user={user}
                    defaultImgUrl={defaultImgUrl}
                    sessionUser={sessionUser}
                  />
                }
              </Media.Item>
              <Media.Item
                position="center"
                style={{ alignSelf: 'center' }}
              >
                <Heading size={4} style={{ color: 'white' }}>{_.get(user, 'data.profile.name', username)}</Heading>
                <Heading subtitle size={6} style={{ color: 'white' }}>
                  {username}
                </Heading>
                <FollowButton
                  defaultImgUrl={defaultImgUrl}
                  sessionUser={sessionUser}
                  user={user}
                  username={username}
                />
              </Media.Item>
            </Media>
          </Columns.Column>
          <Columns.Column size={12} style={{ paddingTop: '0' }}>
            <UserTabs
              username={username}
              profileClicked={this.props.profileClicked}
              setProfileClickedFalse={this.props.setProfileClickedFalse}
            />
          </Columns.Column>
        </Columns>
      </Container>
    )
  }
}

export default UserHero
