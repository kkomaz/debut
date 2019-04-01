import React, { Component } from 'react'
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
      count,
      voter,
      showModal: false,
    }

    this.addOrRemoveVote = _.debounce(this.addOrRemoveVote, 300)
  }

  static propTypes = {
    detailObj: PropTypes.object.isRequired,
    // voter: PropTypes.object.isRequired,
    // toggleVote: PropTypes.func.isRequired,
    toggleComment: PropTypes.func.isRequired,
  }

  addOrRemoveVote = () => {
    const { detailObj } = this.props
    const { sessionUser } = this.context.state

    const voter = _.find(detailObj.votes, (vote) => vote.username === sessionUser.username)

    if (voter) {
      this.props.requestRemoveVote(detailObj, voter)
    } else {
      this.props.requestAddVote(sessionUser.username, detailObj._id)
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
    const { showModal } = this.state

    // const iconHeartsClassName = classNames({
    //   'actionable-container__icons-hearts': true,
    //   'actionable-container__icons-hearts--single': count < 10,
    //   'actionable-container__icons-hearts--double': count >= 10,
    //   'actionable-container__icons-hearts--triple': count >= 100,
    // })

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

export default connect(null, {
  requestAddVote,
  requestRemoveVote,
})(ActionableContainer)
ActionableContainer.contextType = UserContext
