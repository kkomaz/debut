/** @jsx jsx */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core'
import { Icon } from 'components/icon'
import _ from 'lodash'
import { BulmaLoader } from 'components/bulma'
import {
  Section,
  Heading,
} from 'components/bulma'
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

  render() {
    const { detailObj, voteActions } = this.props
    const { users } = this.state

    if (_.isEmpty(users)) {
      return <div>Loading...</div>
    }

    return (
      <Section
        css={theme => css`
          background-color: ${theme.colors.white};
          padding: 0 0 10px 0;
          border-bottom: 1px solid black;
          padding-bottom: 20px;
        `}
      >
        <div
          css={theme => css`
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${theme.colors.shadow};
            padding: 1em;
          `}
        >
          <Heading
            size={4}
            css={css`
              margin-bottom: 0 !important;
            `}
            >
            {`Liked ${_.get(detailObj, 'votes.length', 0) === 1 ? `${_.get(detailObj, 'votes.length', 0)} time` : `${_.get(detailObj, 'votes.length', 0)} times`}`}
          </Heading>
          <Icon
            className="debut-icon debut-icon--pointer"
            icon="IconX"
            size={32}
            color="8b8687"
            onClick={this.props.closeModal}
          />
        </div>
        {
          voteActions.submitting ?
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
                  <li key={vote.username}>
                    {vote.username}
                    <img
                      onError={this.addDefaultSrc}
                      src={this.state.users[vote.username].profileImgUrl}
                      alt="user"
                      height="42"
                      width="42"
                    />
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

export default LikeModalContent
