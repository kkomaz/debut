import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
} from 'components/bulma'
import { withRouter } from 'react-router-dom'
import './ShareAdminMenu.scss'

class ShareAdminMenu extends Component {
  state = {
    active: 'edit'
  }

  static propTypes = {
    disableGoPath: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    share: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  onEditClick = () => {
    this.setState({ active: 'edit' })
    this.props.onEditClick()
  }

  onDeleteClick = () => {
    this.setState({ active: 'delete' })
    this.props.onDeleteClick()
  }

  onDetailClick = () => {
    const { username, share, history } = this.props
    this.setState({ active: 'detail' })
    return history.push(`/${username}/moments/${share._id}`)
  }

  render() {
    const { active } = this.state
    const { disableGoPath, disableAdminPath } = this.props

    return (
      <Menu
        className="share-admin-menu"
        style={{
          backgroundColor: '#383A3F',
          padding: '15px',
          width: '120px',
        }}
      >
        <Menu.List>
          {
            !disableAdminPath &&
            <Menu.List.Item
              active={active === 'edit'}
              onClick={this.onEditClick}>
              Edit
            </Menu.List.Item>
          }
          {
            !disableAdminPath &&
            <Menu.List.Item
              active={active === 'delete'}
              onClick={this.onDeleteClick}>
              Delete
            </Menu.List.Item>
          }
          {
            !disableGoPath &&
            <Menu.List.Item
              active={active === 'detail'}
              onClick={this.onDetailClick}>
              Go to Moment
            </Menu.List.Item>
          }
        </Menu.List>
      </Menu>
    )
  }
}

ShareAdminMenu.defaultProps = {
  disableGoPath: false,
  disableAdminPath: false,
}

export default withRouter(ShareAdminMenu)
