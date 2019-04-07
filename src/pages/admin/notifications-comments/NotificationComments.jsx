/** @jsx, jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Card,
  Content,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import moment from 'moment'

// Action Imports
import { requestAdminComments } from 'actions/comment'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}

class NotificationComments extends Component {
  static propTypes = {
    commentsObj: PropTypes.shape({
      list: PropTypes.array.isRequired,
      full: PropTypes.object.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired
  }

  componentDidMount() {
    const { sessionUser } = this.context.state

    this.props.requestAdminComments({
      parent_creator: sessionUser.username,
      limit: 10
    })
  }

  onCommentCreatorClick = (e, username) => {
    e.stopPropagation()
    e.preventDefault()
    console.log(username)
  }

  render() {
    const { commentsObj } = this.props

    if (commentsObj.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className="notification-comments">
        <CSSTransitionGroup
          transitionName="admin-activity-feed-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {
            _.map(commentsObj.list, (comment) => {
              return (
                <Card
                  key={comment._id}
                  className="mb-one"
                  onClick={() => console.log('hitting the card')}
                >
                  <Card.Content>
                    <Content>
                      <div>
                        <p onClick={(e) => this.onCommentCreatorClick(e, comment.creator)} style={{ cursor: 'pointer'}}>
                          <strong>{comment.creator}</strong> <span className="small">- {formatDate(comment.createdAt)}</span>
                        </p>

                        <p>
                          Responding to {comment.parent_creator}
                        </p>
                      </div>
                      <p>
                        {comment.text}
                      </p>
                    </Content>
                  </Card.Content>
                </Card>
              )
            })
          }
        </CSSTransitionGroup>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const comments = state.recent.comments

  return {
    commentsObj: comments,
  }
}

export default connect(mapStateToProps, {
  requestAdminComments,
})(NotificationComments)
NotificationComments.contextType = UserContext
