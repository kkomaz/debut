import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserProvider from 'components/User/UserProvider'
import RootPage from 'pages'
import Navbar from 'components/Navbar'
import { requestBlockstackDapps } from 'actions/blockstack'
import './RootRoute.scss'
import UsernamePage from 'pages/username/UsernamePage'
import { Loader } from 'components/Loader'
import { NoUsername } from 'components/User'

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
      return <NoUsername />
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
})(RootRoute))
