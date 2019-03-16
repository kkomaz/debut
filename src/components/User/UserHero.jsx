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
import IconProof from 'components/SocialProofs/IconProof'
import './UserHero.scss'

class UserHero extends Component {
  renderIcons = () => {
    const { userProofs } = this.props

    return _.map(userProofs, (proof) => {
      if (proof.service === 'github') {
        return (
          <IconProof
            clasName="icon-proof mr-two"
            color="white"
            key={proof.service}
            proof={proof}
            size={27}
            linkStyles={{
              marginRight: '10px',
              height: '30px'
            }}
          />
        )
      }
      return (
        <IconProof
          clasName="icon-proof mr-two"
          key={proof.service}
          proof={proof}
          size={27}
          linkStyles={{
            marginRight: '10px',
            height: '30px'
          }}
        />
      )
    })
  }
  render() {
    const { username, user, defaultImgUrl, sessionUser } = this.props

    return (
      <Container className="user-hero">
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
                <div className="user-hero__identity">
                  <div className="user-hero__identity-names mr-one">
                    <Heading size={4} style={{ color: 'white' }}>{_.get(user, 'data.profile.name', username)}</Heading>
                    <Heading subtitle size={6} style={{ color: 'white' }}>
                      {username}
                    </Heading>
                  </div>
                  <div className="user-hero__identity-proofs">
                    {this.renderIcons()}
                  </div>
                </div>

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
            <UserTabs username={username} />
          </Columns.Column>
        </Columns>
      </Container>
    )
  }
}

export default UserHero
