import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Container from 'react-bulma-components/lib/components/container'
import UserProvider from 'components/User/UserProvider'
import AdminUsernameRoute from 'routes/AdminUsernameRoute'
import RootPage from 'pages'
import Navbar from 'components/Navbar'
import { requestBlockstackApps } from 'actions/blockstack'
import requestAllUsers from 'actions/user/requestAllUsers'
import './RootRoute.scss'
import 'react-toastify/dist/ReactToastify.css'
import AdminUsernamePage from 'pages/admin/_username'

class RootRoute extends Component {
  static propTypes = {
    userSession: PropTypes.object.isRequired,
    requestAllUsers: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.requestBlockstackApps()
    this.props.requestAllUsers()
  }

  render() {
    const { userSession, blockstackAppsLoading } = this.props

    if (blockstackAppsLoading) {
      return <div>Loading...</div>
    }

    return (
      <UserProvider userSession={userSession}>
        <Navbar />
        <Container>
          <ToastContainer
            className='toast-container'
          />
          <Switch>
            <Route
              exact
              path="/"
              render={({ location }) => <RootPage />}
            />
            <Route
              exact
              path="/:username"
              render={({ match, location }) => <AdminUsernamePage username={match.params.username} />}
            />
            <Route
              path="/admin/:username"
              render={({ match }) => <AdminUsernameRoute match={match} />}
            />
          </Switch>
        </Container>
      </UserProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blockstackAppsLoading: state.blockstack.loading
  }
}


export default withRouter(connect(mapStateToProps, {
  requestBlockstackApps,
  requestAllUsers,
})(RootRoute))
