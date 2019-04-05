/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
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



    console.log(this.props.styles.nameStyles.fontSize)

    return (
      <Card
        css={css`
          width: 287px;
          height: 279px;
        `}
      >
        <Card.Content
          css={theme => css`
            overflow: hidden;
            background: ${theme.colors.primary};
            height: 90px;
            color: ${theme.colors.white};
          `}
        >
          <div
            css={css`
              padding-left: 80px;
            `}
          >
            <p
              css={theme => css`
                font-weight: 800;
                cursor: pointer;
                font-size: ${this.props.styles.nameStyles.fontSize};

                &:hover {
                  color: ${theme.colors.shadow}
                }
              `}
              onClick={this.navigateTo}
            >
              {user.name || _.get(user, 'profile.name', user.username)}
            </p>
            <p
              className="small"
              css={theme => css`
                cursor: pointer;
                font-size: ${this.props.styles.usernameStyles.fontSize};

                &:hover {
                  color: ${theme.colors.shadow};
                }
              `}
              onClick={this.navigateTo}
            >
              {user.username}
            </p>
          </div>
        </Card.Content>
        <Media css={css`
          position: relative;
        `}>
          <Media.Item renderAs="figure" position="left">
            <Image
              css={theme => css`
                position: absolute;
                top: -65px;
                left: 10px;
                cursor: pointer;

                img {
                  box-shadow: 0px 2px 0px 0px ${theme.colors.shadow};
                  height: 80px;
                  width: 80px;
                  border-radius: 50%;
                  border: 2px solid ${theme.colors.white};
                  box-shadow: 0px 1px 0px 0px ${theme.colors.shadow};
                  background-position: 50% 50%;
                  background-repeat: no-repeat;
                  background-size: cover;
                }
              `}
              onClick={this.navigateTo}
              renderAs="p"
              size={96}
              alt="80x80"
              src={_.get(user, 'profileImgUrl', defaultImgUrl)}
            />
          </Media.Item>
        </Media>
        <Card.Content
          css={css`
            padding: 10px;
            overflow: hidden;
            height: 169px;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: flex-end;
              margin-bottom: 15px;
            `}
          >
            <UserCardButton
              follow={follow}
              user={user}
              currentUser={currentUser}
              disableButton={disableButton}
            />
          </div>

          <p
            className="mt-half small"
            css={css`
              a {
                font-size: 12px;
              }
            `}
          >
            {linkifyText(user.description)}
          </p>
        </Card.Content>
      </Card>
    )
  }
}

UserCard.defaultProps = {
  disableButton: false,
  styles: {
    nameStyles: {
      fontSize: '14px',
    },
    usernameStyles: {
      fontSize: '12px',  
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currentUser } = ownProps

  const follow = state.follow[currentUser.username] || {}

  return {
    follow,
  }
}

export default connect(mapStateToProps, {})(UserCard);
