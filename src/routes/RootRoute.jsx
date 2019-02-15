import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserProvider from 'components/User/UserProvider'
import RootPage from 'pages'
import Navbar from 'components/Navbar'
import { requestBlockstackApps } from 'actions/blockstack'
import requestAllUsers from 'actions/user/requestAllUsers'
import './RootRoute.scss'
import 'react-toastify/dist/ReactToastify.css'
import UsernamePage from 'pages/username/UsernamePage'
import Dapp from 'model/Dapp'

class RootRoute extends Component {
  static propTypes = {
    userSession: PropTypes.object.isRequired,
    requestAllUsers: PropTypes.func.isRequired
  }

  state = {
    loading: true
  }

  componentDidMount() {
    this.props.requestBlockstackApps()
    this.props.requestAllUsers()
    this.fetchDapps()
  }

  fetchDapps() {
    const result = Dapp.fetchList()
    this.setState({ radiksDapps: result, loading: false })
  }

  render() {
    const { userSession, blockstackAppsLoading, radiksDapps } = this.props

    if (blockstackAppsLoading || this.state.loading) {
      return <div>Loading...</div>
    }

    return (
      <UserProvider userSession={userSession}>
        <Navbar />
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
            render={({ match, location }) => <UsernamePage username={match.params.username} radiksDapps={radiksDapps} />}
          />
        </Switch>
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
