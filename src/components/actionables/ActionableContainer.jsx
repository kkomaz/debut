/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import {
  requestAddVote,
  requestRemoveVote,
} from 'actions/vote'

// Component Imports
import { Modal } from 'components/bulma'
import LikeModalContent from './LikeModalContent'

class ActionableContainer extends Component {
  constructor(props) {
    super(props)

    const count = _.get(props.detailObj, 'votes.length', 0)
    const voter = props.voter

    this.state = {
      liked: !_.isEmpty(voter),
      count,
      showModal: false,
      debouncedFunc: null,
    }
  }

  static propTypes = {
    detailObj: PropTypes.object.isRequired,
    voter: PropTypes.object.isRequired,
    toggleComment: PropTypes.func.isRequired,
    voteActions: PropTypes.object.isRequired,
  }

  componentDidUpdate(prevProps, prevState) {
    const { sessionUser } = this.context.state

    if (!prevProps.voteActions.addVoteFailed && this.props.voteActions.addVoteFailed &&
    this.props.detailObj._id === this.props.voteActions.shareId) {
      this.setState({
        liked: !this.state.liked,
        count: this.state.count - 1
      })
    }

    if (!prevProps.voteActions.removeVoteFailed && this.props.voteActions.removeVoteFailed &&
    this.props.detailObj._id === this.props.voteActions.shareId) {
      this.setState({
        liked: !this.state.liked,
        count: this.state.count + 1
      })
    }

    // Update internal state when calling update
    if (!this.props.voteActions.submitting && prevProps.voteActions.submitting) {
      if (this.props.detailObj.votes.length !== this.state.count) {
        const liked = _.find(this.props.detailObj.votes, (vote) => vote.username === sessionUser.username) || false
        this.setState({
          liked,
          count: this.props.detailObj.votes.length
        })
      }
    }
  }

  addOrRemoveVote = () => {
    const { detailObj } = this.props
    const { sessionUser } = this.context.state
    const { liked } = this.state

    if (!liked && !_.isEmpty(this.props.voter)) {
      this.props.requestRemoveVote(detailObj, this.props.voter)
    }

    if (liked && _.isEmpty(this.props.voter)) {
      this.props.requestAddVote(sessionUser.username, detailObj)
    }
  }

  cancelDebouncedFunc() {
  if (this.state.debouncedFunc && this.state.debouncedFunc.cancel) {
    this.state.debouncedFunc.cancel();
  }
}

  toggleState = () => {
    const { voter, count, liked } = this.state

    this.cancelDebouncedFunc();

    if (liked) {
      this.setState({
        count: count - 1,
        liked: !liked,
        debouncedFunc: _.debounce(() => {
          this.addOrRemoveVote({ remove: true, currentVoter: voter })
        }, 300)
      }, () => {
        this.state.debouncedFunc()
      })
    } else {
      this.setState({
        count: count + 1,
        liked: !liked,
        debouncedFunc: _.debounce(() => {
          this.addOrRemoveVote({ add: true })
        }, 300)
      }, () => {
        this.state.debouncedFunc()
      })
    }
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = () => {
    const { detailObj } = this.props

    if (detailObj.votes.length > 0) {
      this.setState({ showModal: true })
    }
  }

  heartStyle = () => {
    const { count } = this.state

    if (count < 10) {
      return css`
        align-items: center;
        display: flex;
        margin-right: 13px;
      `
    }

    if (count >= 10 && count < 100) {
      return css`
        align-items: center;
        display: flex;
        margin-right: 12px;
      `
    }

    return css`
      align-items: center;
      display: flex;
      margin-right: 28px;
    `
  }

  render() {
    const { detailObj, voteActions, hideComment } = this.props
    const { showModal, count, liked } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state

    return (
      <div>
        <div>
          <div
            className="is-divider"
            css={theme => css`
              border-top: 1px solid ${theme.colors.shadow};
              margin-top: 10px !important;
              margin-bottom: 10px !important;
            `}
          >
          </div>

          <div
            css={css`
              display: flex;
              justify-content: flex-end;
              padding: 0 16px;
            `}
          >
            <p
              className="small"
              css={theme => css`
                &:hover {
                  cursor: pointer;
                  color: ${theme.colors.blue}
                }
              `}
              onClick={this.openModal}
            >
              {`${count} ${count > 1 ? 'likes' : 'like'}`}
            </p>
          </div>

          <div
            className="is-divider"
            css={theme => css`
              border-top: 1px solid ${theme.colors.shadow};
              margin-top: 10px !important;
              margin-bottom: 10px !important;
            `}
          >
          </div>
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-end;
          `}
        >
          {
            !hideComment &&
            <div
              css={css`
                align-items: center;
                display: flex;
                margin-right: 10px;
              `}
            >
              <Icon
                className="debut-icon debut-icon--pointer mr-half"
                css={theme => css`
                  &:hover {
                    fill: ${theme.colors.blue} !important;
                  }
                `}
                icon="IconBubble"
                size={15}
                color="8b8687"
                onClick={this.props.toggleComment}
              />
              <span className="small">{_.get(detailObj, 'commentCount', 0)}</span>
            </div>
          }
          <div
            css={this.heartStyle()}
          >
            <Icon
              className="debut-icon debut-icon--pointer actionable-container__toggle-votes"
              icon="IconHeart"
              size={15}
              onClick={this.toggleState}
              color={liked ? '#ff3860' : '#8b8687'}
              linkStyle={{
                height: 'inherit'
              }}
            />
            <span
              className="small ml-half"
              style={{ width: '10px', marginTop: '2px'}}
            >
              {count}
            </span>
          </div>
        </div>

        <Modal
          show={showModal}
          onClose={this.closeModal}
          closeOnEsc
        >
          <Modal.Content>
            <LikeModalContent
              closeModal={this.closeModal}
              detailObj={detailObj}
              voteActions={voteActions}
              currentUser={sessionUser.userData}
              defaultImgUrl={defaultImgUrl}
            />
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const voteActions = state.share.voteActions

  return {
    voteActions,
  }
}

ActionableContainer.defaultProps = {
  hideComment: false
}

export default connect(mapStateToProps, {
  requestAddVote,
  requestRemoveVote,
})(ActionableContainer)
ActionableContainer.contextType = UserContext
