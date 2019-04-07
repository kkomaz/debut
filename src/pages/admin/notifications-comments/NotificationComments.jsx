/** @jsx, jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { UserContext } from 'components/User/UserProvider'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'

// Action Imports
import { requestAdminComments } from 'actions/comment'

class NotificationComments extends Component {
  componentDidMount() {
    const { sessionUser } = this.context.state

    this.props.requestAdminComments({
      parent_creator: sessionUser.username,
      limit: 10
    })
  }

  render() {
    return (
      <div>
        Hello World
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {
    comments: []
  }
}

export default connect(mapStateToProps, {
  requestAdminComments,
})(NotificationComments)
NotificationComments.contextType = UserContext
