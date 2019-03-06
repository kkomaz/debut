// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash';

// Component Imports
import UsernamePage from 'pages/username/UsernamePage'
import { UserContext } from 'components/User/UserProvider'

class UsernameRoute extends Component {
  static propTypes = {
    dapps: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const {
      dapps,
      match,
      user,
      username,
    } = this.props

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          render={() =>
            <UsernamePage
              user={user}
              username={username}
              dapps={dapps}
            />
          }
        />
        <Route
          path={`${match.url}/following`}
          render={() => <div>Hello following</div>}
        />
        <Route
          path={`${match.url}/followers`}
          render={() => <div>Hello followers</div>}
        />
      </Switch>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps

  const user = {
    data: _.find(state.user.users, (user) => user._id === username),
    loading: state.user.loading,
    avatarLoading: state.user.avatarLoading
  }

  return {
    user
  }
}

export default connect(mapStateToProps)(UsernameRoute)
UsernameRoute.contextType = UserContext
