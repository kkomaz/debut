import React, { Component } from 'react'
import _ from 'lodash'
import { Icon } from 'components/icon'
import './ActionableContainer.scss'

class ActionableContainer extends Component {
  render() {
    const { detailObj, voter } = this.props

    return (
      <div className="actionable-container__icons">
        <div className="actionable-container__icons-bubble">
          <Icon
            className="debut-icon actionable-container__view-more-comments mr-half"
            icon="IconBubble"
            size={15}
            color="8b8687"
            linkStyle={{
              height: '20px'
            }}
          />
          <span className="small">{_.get(detailObj, 'commentCount', 0)}</span>
        </div>
        <div className="actionable-container__icons-hearts">
          <Icon
            className="debut-icon debut-icon--pointer actionable-container__toggle-votes"
            icon="IconHeart"
            size={15}
            onClick={this.props.toggleVote}
            color={!_.isEmpty(voter) ? '#ff3860' : '#8b8687'}
            linkStyle={{
              height: '20px'
            }}
          />
        <span
          style={{ width: '10px', marginTop: '3px' }}
          className="small ml-half"
        >
          {_.get(detailObj, 'votes.length', 0)}
        </span>
        </div>
      </div>
    )
  }
}

export default ActionableContainer
