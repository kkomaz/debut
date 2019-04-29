// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

// Component Imports
import Earn from 'pages/earn/Earn'

class EarnRoute extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const { match } = this.props

    return (
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <Earn />}
        />
        <Route
          path={`${match.url}/settings`}
          render={() => <div>Settings</div>}
        />
      </Switch>
    )
  }
}

export default EarnRoute
