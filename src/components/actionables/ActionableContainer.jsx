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
import classNames from 'classnames';
import './ActionableContainer.scss'

class ActionableContainer extends Component {
  constructor(props) {
    super(props)

    const count = _.get(props.detailObj, 'votes.length', 0)
    const voter = props.voter

    this.state = {
      count,
      voter,
    }

    this.addOrRemoveVote = _.debounce(this.addOrRemoveVote, 300)
  }

  static propTypes = {
    detailObj: PropTypes.object.isRequired,
    voter: PropTypes.object.isRequired,
    toggleVote: PropTypes.func.isRequired,
    toggleComment: PropTypes.func.isRequired,
  }

  addOrRemoveVote = () => {
    const { detailObj } = this.props
    const { sessionUser } = this.context.state

    const voter = _.find(detailObj.votes, (vote) => vote.username === sessionUser.username)

    if (voter) {
      this.setState({
        voter: {},
        count: this.state.count - 1
      }, () => {
        this.props.requestRemoveVote(detailObj, voter)
      })
    } else {
      this.setState({
        voter: { added: true },
        count: this.state.count + 1
      })
      this.props.requestAddVote(sessionUser.username, detailObj._id)
    }
  }

  render() {
    const { detailObj } = this.props
    const { voter, count } = this.state

    const iconHeartsClassName = classNames({
      'actionable-container__icons-hearts': true,
      'actionable-container__icons-hearts--single': count < 10,
      'actionable-container__icons-hearts--double': count >= 10,
      'actionable-container__icons-hearts--triple': count >= 100,
    })

    return (
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
            onClick={this.addOrRemoveVote}
            color={!_.isEmpty(voter) ? '#ff3860' : '#8b8687'}
            linkStyle={{
              height: 'inherit'
            }}
          />
          <span className="small ml-half" style={{ width: '10px', marginTop: '2px'}}>{count}</span>
        </div>
      </div>
    )
  }
}

export default connect(null, {
  requestAddVote,
  requestRemoveVote,
})(ActionableContainer)
ActionableContainer.contextType = UserContext
