import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import AdminUsernamePage from 'pages/admin/_username'

class AdminUsernameRoute extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  render() {
    const { match } = this.props

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          render={() => <AdminUsernamePage />}
        />
      </Switch>
    )
  }
}

export default AdminUsernameRoute
