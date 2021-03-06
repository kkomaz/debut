/** @jsx jsx */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import _ from 'lodash'
import { BulmaLoader } from 'components/bulma'
import {
  Section,
  ModalHeader,
} from 'components/bulma'
import { withRouter } from 'react-router-dom'
import { UserCardButton } from 'components/User'
import { User } from 'radiks'

class LikeModalContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: {}
    }
  }

  static propTypes = {
    voteActions: PropTypes.object.isRequired,
    detailObj: PropTypes.object.isRequired,
    follow: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    defaultImgUrl: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { voteActions } = this.props

    if (!voteActions.submitting) {
      this.fetchUsers()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.voteActions.submitting & prevProps.voteActions.submitting) {
      this.fetchUsers()
    }
  }

  fetchUsers = async () => {
    const { detailObj } = this.props
    const usersObj = {}
    const result = await User.fetchList({
      username: _.map(detailObj.votes, 'username')
    })

    const resultsArray = _.map(result, 'attrs')

    _.each(resultsArray, (user) => {
      usersObj[user.username] = user
    })

    this.setState({
      users: usersObj
    })
  }

  addDefaultSrc = (evt) => {
    evt.target.src = 'https://i.imgur.com/w1ur3Lq.jpg'
  }

  navigateToProfile = (username) => {
    const { history } = this.props

    history.push(`/${username}`)
  }

  render() {
    const {
      currentUser,
      detailObj,
      follow,
      voteActions,
      defaultImgUrl,
    } = this.props

    const { users } = this.state

    return (
      <Section
        css={theme => css`
          background-color: ${theme.colors.white};
          padding: 0 0 10px 0;
          border-bottom: 1px solid black;
          padding-bottom: 20px;
        `}
      >
        <ModalHeader
          loading={voteActions.submitting || _.isEmpty(users)}
          headerText={`Liked ${_.get(detailObj, 'votes.length', 0) === 1 ? `${_.get(detailObj, 'votes.length', 0)} time` : `${_.get(detailObj, 'votes.length', 0)} times`}`}
          closeModal={this.props.closeModal}
        />
        {
          voteActions.submitting || _.isEmpty(users) ?
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              padding-top: 20px;
            `}
          >
            <BulmaLoader />
          </div> :
          <ul style={{ padding: '20px' }}>
            {
              _.map(detailObj.votes, (vote) => {
                return (
                  <li
                    css={theme => css`
                      border-bottom: 1px solid ${theme.colors.shadow};
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 10px 0;
                    `}
                    key={vote.username}
                  >
                    <div
                      css={css`
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                      `}
                    >
                      <img
                        css={theme => css`
                          box-shadow: 0px 2px 0px 0px ${theme.colors.shadow};
                          height: 45px;
                          width: 45px;
                          border-radius: 50%;
                          border: 2px solid ${theme.colors.white};
                          box-shadow: 0px 1px 0px 0px ${theme.colors.shadow};
                          background-position: 50% 50%;
                          background-repeat: no-repeat;
                          background-size: cover;
                        `}
                        onError={this.addDefaultSrc}
                        src={_.get(this.state.users[vote.username], 'profileImgUrl', defaultImgUrl)}
                        alt="user"
                        height="42"
                        width="42"
                        />
                      <p
                        css={theme => css`
                          margin-left: 10px;
                          cursor: pointer;

                          &:hover {
                            color: ${theme.colors.blue}
                          }
                        `}
                        onClick={() => this.navigateToProfile(vote.username)}
                      >
                        {vote.username}
                      </p>
                    </div>
                    <div>
                      <UserCardButton
                        follow={follow}
                        user={this.state.users[vote.username]}
                        currentUser={currentUser}
                      />
                    </div>
                  </li>
                )
              })
            }
          </ul>
        }
      </Section>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  const { currentUser } = ownProps

  const follow = state.follow[currentUser.username] || {}

  return {
    follow,
  }
}

export default withRouter(connect(mapStateToProps)(LikeModalContent))
