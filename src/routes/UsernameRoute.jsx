import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import UsernamePage from 'pages/username/UsernamePage'

class UsernameRoute extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    dapps: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
  }

  render() {
    const { dapps, match, username } = this.props

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          render={() =>
            <UsernamePage
              username={username}
              dapps={dapps}
            />
          }
        />
      </Switch>
    )
  }
}

export default UsernameRoute
