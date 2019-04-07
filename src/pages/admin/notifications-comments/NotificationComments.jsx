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

// Action Imports
import { requestAdminComments } from 'actions/comment'

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

  render() {
    const { commentsObj } = this.props

    if (commentsObj.loading) {
      return <div>Loading...</div>
    }

    console.log(commentsObj.list)

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
                <Card key={comment._id} className="mb-one">
                  <Card.Content>
                    <Content>
                      Hello World
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
