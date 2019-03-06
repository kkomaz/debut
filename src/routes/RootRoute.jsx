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
import { Loader } from 'components/Loader'
import { NoUsername } from 'components/User'
import { requestFetchFollow} from 'actions/follow'
import UsernameRoute from './UsernameRoute'
import './RootRoute.scss'

class RootRoute extends Component {
  constructor(props) {
    super(props)

    const userData = props.userSession.loadUserData()

    this.state = {
      homePageClicked: false,
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
        <Navbar
          setHomePageClickedTrue={this.setHomePageClickedTrue}
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
                  match={match}
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
  requestFetchFollow,
})(RootRoute))
