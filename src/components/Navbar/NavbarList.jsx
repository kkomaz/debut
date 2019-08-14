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
    goToRecentMentions: PropTypes.func.isRequired,
    onHelpClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    viewObj: PropTypes.shape({
      comment: PropTypes.object.isRequired,
    }).isRequired
  }

  render() {
    const { viewObj } = this.props

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
            css={css`
              position: relative;
            `}
            onClick={this.props.goToRecent}
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
                display: ${_.isEmpty(viewObj.comment) ? 'flex' : 'none'};
                position: absolute;
                top: 50%;
                left: -18px;
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
          </Menu.List.Item>
          <Menu.List.Item
            css={css`
              position: relative;
            `}
            onClick={this.props.goToRecentMentions}
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
                display: ${_.isEmpty(viewObj.mention) ? 'flex' : 'none'};
                position: absolute;
                top: 50%;
                left: -18px;
                transform: translateY(-50%);
              `}
            />
            Recent @
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
