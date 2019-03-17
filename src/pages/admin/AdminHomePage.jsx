import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'components/bulma'
import { withRouter } from 'react-router-dom'
import { User } from 'radiks'
import Follow from 'model/follow'
import _ from 'lodash'

class AdminHomePage extends Component {
  static propTypes = {
    username: PropTypes.object.isRequired,
  }

  render() {
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
