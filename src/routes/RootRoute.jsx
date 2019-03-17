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
import Share from 'model/share'
import "./RootRoute.scss";

class RootRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      homePageClicked: false,
      profileClicked: false,
    };
  }

  static propTypes = {
    userSession: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.requestBlockstackDapps();
    this.props.requestFetchFollow(this.props.username);
    Share.addStreamListener((share) => {
      this.addShareToActivites(share)
    })
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

  addShareToActivites(share) {
    console.log(share)
    console.log(this.props)
  }

  render() {
    const {
      userSession,
      blockstackDappsLoading,
      dapps,
      username,
      userFollow,
    } = this.props;

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
          />
          <Switch>
            <Route
              exact
              path="/"
              render={({ match }) =>
                <AdminUsernameRoute
                  match={match}
                  username={username}
                  userSession={userSession}
                  userFollow={userFollow}
                />
              }
            />

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
  const userFollow = state.follow[ownProps.username] || {}

  return {
    blockstackDappsLoading: state.blockstack.dapps.loading,
    dapps: state.blockstack.dapps.list,
    userFollow,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      requestBlockstackDapps,
      requestFetchFollow
    }
  )(RootRoute)
);
