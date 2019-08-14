import React, { Component } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserProvider from "components/User/UserProvider";
import RootPage from "pages";
import Navbar from "components/Navbar";
import { requestBlockstackDapps } from "actions/blockstack";
import UnsignedUser from "pages/unsigned/UnsignedUser";
import HelpPage from "pages/help/HelpPage";
import AdminUsernameRoute from "./AdminUsernameRoute";
import { Loader } from "components/Loader";
import { NoUsername } from "components/User";
import { requestFetchFollow } from "actions/follow";
import UsernameRoute from "./UsernameRoute";
import { RootContext } from "components/context/DebutContext";
import { requestSingleUser } from 'actions/user'
import BackOfficeRoute from './BackOfficeRoute'

import "./RootRoute.scss";

class RootRoute extends Component {
  constructor(props) {
    super(props);

    const userData = props.userSession.loadUserData();

    this.state = {
      homePageClicked: false,
      profileClicked: false,
      username: userData.username
    };

    this.adminUsernameRef = React.createRef();
  }

  static propTypes = {
    userSession: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { username } = this.state
    this.props.requestSingleUser(username)
    this.props.requestBlockstackDapps();
    this.props.requestFetchFollow(this.state.username);
  }

  setHomePageClickedTrue = () => {
    this.setState({ homePageClicked: true });
  };

  setHomePageClickedFalse = () => {
    this.setState({ homePageClicked: false });
  };

  setProfileClickedTrue = () => {
    this.setState({ profileClicked: true });
  };

  setProfileClickedFalse = () => {
    this.setState({ profileClicked: false });
  };

  render() {
    const {
      userSession,
      blockstackDappsLoading,
      dapps,
    } = this.props;

    const {
      username
    } = this.state

    if (!username) {
      return <NoUsername userSession={userSession} />;
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
            username={username}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={({ match }) =>
                <Redirect
                  to={{
                    pathname: '/admin'
                  }}
                />
              }
            />

            <Route
              path="/admin"
              render={({ match, location }) =>
                <AdminUsernameRoute
                  match={match}
                  username={username}
                  userSession={userSession}
                  location={location}
                />
              }
            />

            <Route
              path="/back-office"
              render={({ match }) =>
                <BackOfficeRoute
                  match={match}
                />
              }
            />

            {/*
              <Route
                path="/earn"
                render={({ match, location }) =>
                  <EarnRoute
                    match={match}
                    location={location}
                  />
                }
              />
            */}

            <Route
              exact
              path="/explore"
              render={() =>
                <RootPage
                  homePageClicked={this.state.homePageClicked}
                  setHomePageClickedFalse={this.setHomePageClickedFalse}
                />
              }
            />

            <Route exact path="/help" render={() => <HelpPage />} />

            <Route
              exact
              path="/unsigned/:username"
              render={({ match }) => <UnsignedUser match={match} />}
            />

            {blockstackDappsLoading ? (
              <Loader cardWrapped contained text="App is warming up..." />
            ) : (
              <Route
                path="/:username"
                render={({ match, location }) => (
                  <UsernameRoute
                    dapps={dapps}
                    match={match}
                    username={match.params.username}
                  />
                )}
              />
            )}
          </Switch>
        </RootContext.Provider>
      </UserProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    blockstackDappsLoading: state.blockstack.dapps.loading,
    dapps: state.blockstack.dapps.list,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      requestBlockstackDapps,
      requestFetchFollow,
      requestSingleUser,
    }
  )(RootRoute)
);
