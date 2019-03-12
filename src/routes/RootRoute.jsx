import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserProvider from 'components/User/UserProvider'
import RootPage from 'pages'
import Navbar from 'components/Navbar'
import { requestBlockstackDapps } from 'actions/blockstack'
import UnsignedUser from 'pages/unsigned/UnsignedUser'
import HelpPage from 'pages/help/HelpPage'
import AdminPage from 'pages/admin/AdminPage'
import { Loader } from 'components/Loader'
import { NoUsername } from 'components/User'
import { requestFetchFollow} from 'actions/follow'
import UsernameRoute from './UsernameRoute'
import { RootContext } from 'components/context/DebutContext'
import './RootRoute.scss'

class RootRoute extends Component {
  constructor(props) {
    super(props)

    const userData = props.userSession.loadUserData()

    this.state = {
      homePageClicked: false,
      profileClicked: false,
      username: userData.username,
    }
  }

  static propTypes = {
    userSession: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.requestBlockstackDapps()
    this.props.requestFetchFollow(this.state.username)
  }

  setHomePageClickedTrue = () => {
    this.setState({ homePageClicked: true })
  }

  setHomePageClickedFalse = () => {
    this.setState({ homePageClicked: false })
  }

  setProfileClickedTrue = () => {
    this.setState({ profileClicked: true })
  }

  setProfileClickedFalse = () => {
    this.setState({ profileClicked: false })
  }

  render() {
    const {
      userSession,
      blockstackDappsLoading,
      dapps,
    } = this.props

    const { username } = this.state

    if (!username) {
      return <NoUsername userSession={userSession} />
    }

    return (
      <UserProvider userSession={userSession}>
        <RootContext.Provider
          value={{
            state: this.state,
            setProfileClickedFalse: this.setProfileClickedFalse
          }}
        >
          <Navbar
            setHomePageClickedTrue={this.setHomePageClickedTrue}
            setProfileClickedTrue={this.setProfileClickedTrue}
            />
          <Switch>
            <Route
              exact
              path="/"
              render={({ location }) =>
                <RootPage
                  homePageClicked={this.state.homePageClicked}
                  setHomePageClickedFalse={this.setHomePageClickedFalse}
                />
              }
            />
          <Route
            exact
            path="/admin"
            render={() => <AdminPage username={username} />}
            userSession={userSession}
          />
          <Route
            exact
            path="/help"
            render={() => <HelpPage />}
          />
          <Route
            exact
            path="/unsigned/:username"
            render={({ match }) => <UnsignedUser match={match} />}
          />
          {
            blockstackDappsLoading ?
            <Loader
              cardWrapped
              contained
              text="App is warming up..."
              /> :
              <Route
                path="/:username"
                render={({ match, location }) =>
                  <UsernameRoute
                    dapps={dapps}
                    match={match}
                    username={match.params.username}
                  />
                }
              />
          }
          </Switch>
        </RootContext.Provider>
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
  requestFetchFollow,
})(RootRoute))
