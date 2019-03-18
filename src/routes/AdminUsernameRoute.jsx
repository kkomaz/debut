// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash';
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// Component Imports
import AdminActivityFeed from 'pages/admin/AdminActivityFeed'
import {
  Menu,
  Columns,
  Container
} from 'components/bulma'
import BarLoader from 'components/Loader/BarLoader'
import AdminFollowersUsers from 'components/Follow/AdminFollowersUsers'
import AdminFollowingUsers from 'components/Follow/AdminFollowingUsers'
import { RandomUsers } from 'components/User'

// Stylesheets
import './AdminMenu.scss'

class AdminUsernameRoute extends Component {
  constructor(props) {
    super(props)
    let activeMenu

    const pathArray = props.location.pathname.split('/')
    const path = _.last(pathArray)

    const paths = ['following', 'followers']

    if (!_.includes(paths, path)) {
      activeMenu = 'activityFeed'
    } else {
      activeMenu = path
    }

    this.state = {
      active: activeMenu
    }
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
    this.props.history.push('/admin')
  }

  onFollowersClick = () => {
    this.onMenuItemClick('followers')
    this.props.history.push('/admin/followers')
  }

  onFollowingClick = () => {
    this.onMenuItemClick('following')
    this.props.history.push('/admin/following')
  }

  render() {
    const {
      match,
      username,
      userFollow,
      loading,
    } = this.props

    const { active } = this.state

    const followingText = !loading && !_.isEmpty(userFollow) ? `Following (${userFollow.followingCount})` : 'Following'
    const followersText = !loading && !_.isEmpty(userFollow) ? `Following (${userFollow.followersCount})` : 'Followers'

    return (
      <Container>
        <Columns>
          <Columns.Column size={2}>
            <Menu className="admin-menu">
              <Menu.List title={username} className="admin-menu__title">
                <Menu.List.Item active={active === 'activityFeed'} onClick={this.onActivityFeedClick}>Activity Feed</Menu.List.Item>
                <Menu.List.Item
                  active={active === 'following'}
                  onClick={this.onFollowingClick}>
                    {followingText}
                  </Menu.List.Item>
                <Menu.List.Item
                  active={active === 'followers'}
                  onClick={this.onFollowersClick}>
                    {followersText}
                </Menu.List.Item>
              </Menu.List>
            </Menu>
          </Columns.Column>
          <Columns.Column size={6}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => (
                  _.isEmpty(userFollow) ? <BarLoader /> : <AdminActivityFeed userFollow={userFollow} />
                )}
              />
              <Route
                exact
                path={`/admin/following`}
                render={() => (
                  <AdminFollowingUsers
                    follow={userFollow}
                    size={4}
                  />
                )}
              />
              <Route
                path={`/admin/followers`}
                render={() =>
                  <AdminFollowersUsers
                    follow={userFollow}
                  />
                }
              />
            </Switch>
          </Columns.Column>
          <Columns.Column size={4}>
            <RandomUsers />
          </Columns.Column>
        </Columns>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userFollow = state.follow[ownProps.username] || {}
  const loading = state.follow.loading

  return {
    userFollow,
    loading,
  };
};

export default withRouter(connect(mapStateToProps)(AdminUsernameRoute))
