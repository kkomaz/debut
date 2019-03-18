// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash';
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

// Component Imports
import AdminActivityFeed from 'pages/admin/AdminActivityFeed'
import {
  Menu,
  Columns,
  Container
} from 'components/bulma'
import BarLoader from 'components/Loader/BarLoader'

// Stylesheets
import './AdminMenu.scss'

class AdminUsernameRoute extends Component {
  state = {
    active: 'activityFeed'
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    userFollow: PropTypes.object.isRequired,
  }

  onMenuItemClick = (value) => {
    this.setState({ active: value })
  }

  onActivityFeedClick = () => {
    this.onMenuItemClick('activityFeed')
  }

  onFollowersClick = () => {
    this.onMenuItemClick('followers')
  }

  onFollowingClick = () => {
    this.onMenuItemClick('following')
  }

  render() {
    const {
      match,
      username,
      userFollow,
    } = this.props

    const { active } = this.state

    return (
      <Container>
        <Columns>
          <Columns.Column size={2}>
            <Menu className="admin-menu">
              <Menu.List title={username} className="admin-menu__title">
                <Menu.List.Item active={active === 'activityFeed'} onClick={this.onActivityFeedClick}>Activity Feed</Menu.List.Item>
                <Menu.List.Item active={active === 'followers'} onClick={this.onFollowersClick}>Following</Menu.List.Item>
                <Menu.List.Item active={active === 'following'} onClick={this.onFollowingClick}>Followers</Menu.List.Item>
              </Menu.List>
            </Menu>
          </Columns.Column>
          <Columns.Column size={7}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => (
                  _.isEmpty(userFollow) ? <BarLoader /> : <AdminActivityFeed userFollow={userFollow} />
                )}
              />
            </Switch>
          </Columns.Column>
          <Columns.Column size={3}>
            <Menu className="admin-menu">
              <Menu.List title={username}>
                <Menu.List.Item>Activity Feed</Menu.List.Item>
                <Menu.List.Item>Following</Menu.List.Item>
                <Menu.List.Item>Followers</Menu.List.Item>
              </Menu.List>
            </Menu>
          </Columns.Column>
        </Columns>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userFollow = state.follow[ownProps.username] || {}

  return {
    userFollow,
  };
};

export default connect(mapStateToProps)(AdminUsernameRoute)
