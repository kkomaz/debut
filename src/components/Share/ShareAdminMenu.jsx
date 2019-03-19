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
    return history.push(`/user/${username}/shares/${share._id}`)
  }

  render() {
    const { username } = this.props
    const { active } = this.state

    return (
      <Menu
        className="share-admin-menu"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          color: 'white',
          width: '200px',
        }}
      >
        <Menu.List title={username} className="share-admin-menu__title">
          <Menu.List.Item
            active={active === 'edit'}
            onClick={this.onEditClick}>
              Edit
          </Menu.List.Item>
          <Menu.List.Item
            active={active === 'delete'}
            onClick={this.onDeleteClick}>
              Delete
            </Menu.List.Item>
          <Menu.List.Item
            active={active === 'detail'}
            onClick={this.onDetailClick}>
              Go to Share
          </Menu.List.Item>
        </Menu.List>
      </Menu>
    )
  }
}

export default withRouter(ShareAdminMenu)
