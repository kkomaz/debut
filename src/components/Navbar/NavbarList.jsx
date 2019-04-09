/** @jsx jsx */
/* eslint-disable jsx-a11y/anchor-is-valid */

// Library Imports
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import PropTypes from 'prop-types'
import _ from 'lodash'

// Component Imports
import { Menu } from 'components/bulma'
import { Icon } from 'components/icon'
import './NavbarList.scss'

class NavbarList extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onHomeClick: PropTypes.func.isRequired,
    onHelpClick: PropTypes.func.isRequired,
    onProfileClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
    view: PropTypes.object.isRequired
  }

  render() {
    const { view } = this.props

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
            <a
              onClick={this.props.goToRecent}
              css={css`
                position: relative;
              `}
              className="navbarlist__recent-comments"
              to="/"
            >
              <div
                css={theme => css`
                  background: ${theme.colors.blue};
                  border-radius: 15px;
                  color: ${theme.colors.white};
                  justify-content: center;
                  align-items: center;
                  height: 18px;
                  width: 18px;
                  box-sizing: border-box;
                  line-height: 1;
                  min-width: 16px;
                  opacity: 1;
                  padding: 2px 4px 3px;
                  display: ${_.isEmpty(view) ? 'flex' : 'none'};
                  position: absolute;
                  top: 50%;
                  left: 60%;
                  transform: translateY(-50%);
                `}
              />
              <div className="mr-quarter">
                Recent
                <Icon
                  className="ml-half mb-quarter"
                  icon="IconBubble"
                  size={14}
                  />
              </div>
            </a>
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
