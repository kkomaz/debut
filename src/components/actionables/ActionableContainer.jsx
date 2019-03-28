import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import {
  requestAddVote,
  requestRemoveVote,
} from 'actions/vote'
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

    return (
      <div className="actionable-container__icons">
        <div className="actionable-container__icons-bubble">
          <Icon
            className="debut-icon actionable-container__view-more-comments mr-half"
            icon="IconBubble"
            size={15}
            color="8b8687"
          />
          <span className="small">{_.get(detailObj, 'commentCount', 0)}</span>
        </div>
        <div className="actionable-container__icons-hearts">
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
        <span
          style={{ width: '10px', marginTop: '3px' }}
          className="small ml-half"
        >
          {count}
        </span>
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
