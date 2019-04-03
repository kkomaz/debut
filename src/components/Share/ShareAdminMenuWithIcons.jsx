import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
} from 'components/bulma'
import { Icon } from 'components/icon'
import './ShareAdminMenu.scss'

class ShareMenuAdmin extends Component {
  state = {
    active: 'edit'
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
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
    this.setState({ active: 'detail' })
    this.props.onEditClick()
  }

  render() {
    const { username } = this.props
    const { active } = this.state

    return (
      <Menu
        className="share-admin-menu"
        style={{
          padding: '20px',
          width: '200px',
        }}
      >
        <Menu.List title={username} className="share-admin-menu__title">
          <Menu.List.Item
            active={active === 'edit'}
            onClick={this.onEditClick}>
              <div className="share-admin-menu__edit-container mb-one">
                <p className="share-admin-menu__text-option">
                  Edit
                </p>
                <Icon
                  className="debut-icon debut-icon--pointer ml-one"
                  icon="IconPencil"
                  color="#518DCA"
                />
              </div>
          </Menu.List.Item>
          <Menu.List.Item
            active={active === 'delete'}
            onClick={this.onDeleteClick}>
              <div className="share-admin-menu__delete-container mb-one">
                <p className="share-admin-menu__text-option">Delete</p>
                <Icon
                  className="debut-icon debut-icon--pointer ml-one"
                  icon="IconTrash"
                  color="#EA1D64"
                />
              </div>
            </Menu.List.Item>
          <Menu.List.Item
            active={active === 'detail'}
            onClick={this.onFollowersClick}>
            <div className="share-admin-menu__go-to-container">
              <p className="share-admin-menu__text-option">Go to Moment</p>
              <Icon
                className="debut-icon debut-icon--pointer ml-one"
                icon="IconGo"
                color="#3ac569"
              />
            </div>
          </Menu.List.Item>
        </Menu.List>
      </Menu>
    )
  }
}

export default ShareMenuAdmin
