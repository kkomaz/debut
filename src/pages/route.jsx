import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import UserProvider from 'components/User/UserProvider'

class Routes extends Component {
  static propTypes = {
    userSession: PropTypes.object.isRequired
  }

  render() {
    const { userSession } = this.props

    return (
      <UserProvider userSession={userSession}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <div>Home Page</div>}
          />
          <Route
            path="/admin/:username"
            render={({ match }) => <div>{match.params.username}</div>}
          />
        </Switch>
      </UserProvider>
    )
  }
}

export default Routes
