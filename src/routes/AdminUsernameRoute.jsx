import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AdminHomePage from 'pages/admin/AdminHomePage'
import {
  Menu,
  Columns,
  Container
} from 'components/bulma'
import './AdminMenu.scss'

class AdminUsernameRoute extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    userFollow: PropTypes.object.isRequired,
  }

  render() {
    const {
      match,
      username,
      userFollow,
    } = this.props

    return (
      <Container>
        <Columns>
          <Columns.Column size={2}>
            <Menu className="admin-menu">
              <Menu.List title={username}>
                <Menu.List.Item>Activity Feed</Menu.List.Item>
                <Menu.List.Item>Following</Menu.List.Item>
                <Menu.List.Item>Followers</Menu.List.Item>
              </Menu.List>
            </Menu>
          </Columns.Column>
          <Columns.Column size={7}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => <AdminHomePage userFollow={userFollow} />}
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
