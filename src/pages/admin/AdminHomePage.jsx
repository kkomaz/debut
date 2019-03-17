import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'components/bulma'
import { withRouter } from 'react-router-dom'
import { User } from 'radiks'
import Follow from 'model/follow'
import _ from 'lodash'
import Share from 'model/share'

class AdminHomePage extends Component {
  static propTypes = {
    userFollow: PropTypes.object.isRequired,
  }

  componentDidMount() {
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

export default withRouter(AdminHomePage)
