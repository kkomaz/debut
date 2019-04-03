import React, { Component } from 'react'
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
import {
  Modal,
  Section,
  Heading,
} from 'components/bulma'
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

    console.log(this.props.voter)
    console.log(liked, 'liked')

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
        }, 500)
      }, () => {
        this.state.debouncedFunc()
      })
    } else {
      this.setState({
        count: count + 1,
        liked: !liked,
        debouncedFunc: _.debounce(() => {
          this.addOrRemoveVote({ add: true })
        }, 500)
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

    return (
      <React.Fragment>
        <div className="actionable-container__icons">
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
            <Section className="avatar-form__section">
              <Heading
                className="avatar-form__section-title"
                size={4}
              >
                {`Liked ${_.get(detailObj, 'votes.length', 0) === 1 ? `${_.get(detailObj, 'votes.length', 0)} time` : `${_.get(detailObj, 'votes.length', 0)} times`}`}
              </Heading>
              <ul style={{ padding: '20px' }}>
                {
                  _.map(detailObj.votes, (vote) => {
                    return (
                      <li key={vote.username}>
                        {vote.username}
                      </li>
                    )
                  })
                }
              </ul>
            </Section>
          </Modal.Content>
        </Modal>
      </React.Fragment>
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
