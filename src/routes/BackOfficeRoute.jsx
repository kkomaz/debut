// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import BoSubmissionHistory from 'components/back-office/BoSubmissionHistory'

class BackOfficeRoute extends Component {
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
          render={() => <BoSubmissionHistory />}
        />
      </Switch>
    )
  }
}

export default BackOfficeRoute
