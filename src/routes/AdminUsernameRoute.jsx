/** @jsx jsx */
// Library Imports
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
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
import { RandomUsers } from 'components/User'
import RecentComments from 'pages/admin/recent-comments/RecentComments'
import Mentions from 'pages/admin/mentions/Mentions'

// Stylesheets
import './AdminMenu.scss'

class AdminUsernameRoute extends Component {
  constructor(props) {
    super(props)
    let activeMenu

    const pathArray = props.location.pathname.split('/')
    const path = _.last(pathArray)

    const paths = ['following', 'followers', 'recent-comments', 'mentions']

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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const arrayPaths = this.props.location.pathname.split('/')
      const last = _.last(arrayPaths)


      if (last !== 'admin') {
        this.setState({ active: _.last(arrayPaths)})
      }
    }
  }

  onMenuItemClick = (value) => {
    this.setState({ active: value })
  }

  onActivityFeedClick = () => {
    this.onMenuItemClick('activityFeed')
    this.props.history.push('/admin')
  }

  onFollowersClick = () => {
    const { username } = this.props
    this.onMenuItemClick('followers')
    this.props.history.push(`/${username}/followers`)
  }

  onFollowingClick = () => {
    const { username } = this.props
    this.onMenuItemClick('following')
    this.props.history.push(`/${username}/following`)
  }

  onNotificationCommentsClick = () => {
    this.onMenuItemClick('recent-comments')
    this.props.history.push('/admin/recent-comments')
  }

  onNotificationMentionsClick = () => {
    this.onMenuItemClick('mentions')
    this.props.history.push('/admin/mentions')
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
    const followersText = !loading && !_.isEmpty(userFollow) ? `Followers (${userFollow.followersCount})` : 'Followers'

    return (
      <Container>
        <Columns>
          <Columns.Column size={2}>
            <Menu
              className="admin-menu"
              css={css`
                .admin-menu__recent {
                  margin-top: 10px !important;
                  padding-left: 0 !important;
                  margin-left: 20px !important;
                }
              `}
            >
              <Menu.List title={username} className="admin-menu__title">
                <Menu.List.Item active={active === 'activityFeed'} onClick={this.onActivityFeedClick}>Activity Feed</Menu.List.Item>
                <Menu.List.Item>
                  <Menu.List
                    className="admin-menu__recent"
                    title="Recent"
                  >
                    <Menu.List.Item
                      active={active === 'recent-comments'}
                      onClick={this.onNotificationCommentsClick}>
                        Comments
                    </Menu.List.Item>
                    <Menu.List.Item
                      active={active === 'mentions'}
                      onClick={this.onNotificationMentionsClick}>
                        Mentions
                    </Menu.List.Item>
                  </Menu.List>
                </Menu.List.Item>
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
          <Switch>
            <Route
              exact
              path={match.url}
              render={() => (
                _.isEmpty(userFollow) ?
                <React.Fragment>
                  <Columns.Column size={6}>
                    <BarLoader />
                  </Columns.Column>
                  <Columns.Column size={4}>
                    <RandomUsers />
                  </Columns.Column>
                </React.Fragment> :
                <React.Fragment>
                  <Columns.Column size={6}>
                    <AdminActivityFeed userFollow={userFollow} />
                  </Columns.Column>
                  <Columns.Column size={4}>
                    <RandomUsers />
                  </Columns.Column>
                </React.Fragment>
              )}
            />
            <Route
              path={`${match.url}/recent-comments`}
              render={() => (
                <React.Fragment>
                  <Columns.Column size={6}>
                    <RecentComments />
                  </Columns.Column>
                  <Columns.Column size={4}>
                    <RandomUsers />
                  </Columns.Column>
                </React.Fragment>
              )}
            />
            <Route
              path={`${match.url}/mentions`}
              render={() => (
                <React.Fragment>
                  <Columns.Column size={6}>
                    <Mentions />
                  </Columns.Column>
                  <Columns.Column size={4}>
                    <RandomUsers />
                  </Columns.Column>
                </React.Fragment>
              )}
            />
          </Switch>
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
