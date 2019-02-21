import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserProvider from 'components/User/UserProvider'
import RootPage from 'pages'
import Navbar from 'components/Navbar'
import {
  requestBlockstackDapps,
} from 'actions/blockstack'
import requestAllUsers from 'actions/user/requestAllUsers'
import './RootRoute.scss'
import 'react-toastify/dist/ReactToastify.css'
// import UsernamePageTemp from 'pages/username/UsernamePageTemp'
import UsernamePage from 'pages/username/UsernamePage'
import { Loader } from 'components/Loader'

class RootRoute extends Component {
  static propTypes = {
    userSession: PropTypes.object.isRequired,
    requestAllUsers: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.requestBlockstackDapps()
    this.props.requestAllUsers()
  }

  render() {
    const {
      userSession,
      blockstackDappsLoading,
      dapps,
    } = this.props

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
          {
            blockstackDappsLoading ?
            <Loader
              cardWrapped
              contained
              text="App is warming up..."
            /> :
            <Route
              exact
              path="/:username"
              render={({ match, location }) =>
                <UsernamePage
                  username={match.params.username}
                  dapps={dapps}
                />
              }
            />
          }
        </Switch>
      </UserProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blockstackDappsLoading: state.blockstack.dapps.loading,
    dapps: state.blockstack.dapps.list,
  }
}


export default withRouter(connect(mapStateToProps, {
  requestBlockstackDapps,
  requestAllUsers,
})(RootRoute))
