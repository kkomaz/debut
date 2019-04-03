/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import PropTypes from 'prop-types'
import classNames from 'classnames';
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
import './ActionableContainer.scss'

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
  }

  addOrRemoveVote = () => {
    const { detailObj } = this.props
    const { sessionUser } = this.context.state
    const { liked } = this.state

    if (!liked && !_.isEmpty(this.props.voter)) {
      this.props.requestRemoveVote(detailObj, this.props.voter)
    }

    if (liked && _.isEmpty(this.props.voter)) {
      this.props.requestAddVote(sessionUser.username, detailObj._id)
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

  render() {
    const { detailObj } = this.props
    const { showModal, count, liked } = this.state

    const iconHeartsClassName = classNames({
      'actionable-container__icons-hearts': true,
      'actionable-container__icons-hearts--single': count < 10,
      'actionable-container__icons-hearts--double': count >= 10,
      'actionable-container__icons-hearts--triple': count >= 100,
    })

    console.log(detailObj.votes)

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
              padding: 0 17px;
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
          <div className="actionable-container__icons-bubble">
            <Icon
              className="debut-icon debut-icon--pointer actionable-container__view-more-comments mr-half"
              icon="IconBubble"
              size={15}
              color="8b8687"
              onClick={this.props.toggleComment}
            />
            <span className="small">{_.get(detailObj, 'commentCount', 0)}</span>
          </div>
          <div className={iconHeartsClassName}>
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
            />
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const submitting = state.share.voteActions.submitting

  return {
    submitting
  }
}

export default connect(mapStateToProps, {
  requestAddVote,
  requestRemoveVote,
})(ActionableContainer)
ActionableContainer.contextType = UserContext
