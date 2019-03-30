import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'components/bulma'
import './NavbarList.scss'

class NavbarList extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onHomeClick: PropTypes.func.isRequired,
    onHelpClick: PropTypes.func.isRequired,
    onProfileClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Menu
        className="navbar-list"
        style={{
          backgroundColor: '#383A3F',
          padding: '20px',
          width: '200px',
        }}
      >
        <Menu.List>
          <Menu.List.Item
            onClick={this.props.onHomeClick}
          >
            Home
          </Menu.List.Item>
          <Menu.List.Item
            onClick={this.props.onProfileClick}
          >
            Profile
          </Menu.List.Item>
          <Menu.List.Item
            onClick={this.props.onHelpClick}
          >
            Help
          </Menu.List.Item>
          <Menu.List.Item
            onClick={this.props.onSignOutClick}
          >
            Sign Out
          </Menu.List.Item>
        </Menu.List>
      </Menu>
    )
  }
}

export default NavbarList
