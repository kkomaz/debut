// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// Model Imports
import _ from 'lodash'
import { Card } from 'components/bulma'
import { User } from 'radiks'
import Follow from 'model/follow'
import Share from 'model/share'

// Action Imports
import { requestFetchShareFeeds } from 'actions/share'

class AdminHomePage extends Component {
  static propTypes = {
    userFollow: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.requestFetchShareFeeds(this.props.userFollow)
    Share.addStreamListener((share) => {
      this.addShareToActivites(share)
    })
  }

  addShareToActivites(share) {
    console.log(share)
    console.log(this.props)
  }

  render() {
    const { userFollow } = this.props

    console.log(userFollow)
    return (
      <Card className="admin-home-page">
        <Card.Content>
          Admin Home Page
        </Card.Content>
      </Card>
    )
  }
}

export default withRouter(connect(null, {
  requestFetchShareFeeds,
})(AdminHomePage))
