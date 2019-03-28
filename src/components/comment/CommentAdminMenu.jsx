import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
} from 'components/bulma'
import { withRouter } from 'react-router-dom'
import './CommentAdminMenu.scss'

class CommentAdminMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: props.editClick ? 'edit' : 'delete'
    }
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    share: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
  }

  onEditClick = () => {
    this.setState({ active: 'edit' })
    this.props.onEditClick()
  }

  onDeleteClick = () => {
    this.setState({ active: 'delete' })
    this.props.onDeleteClick()
  }

  render() {
    const { active } = this.state

    if (this.props.onEditClick) {
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
          <Menu.List>
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
          </Menu.List>
        </Menu>
      )
    }

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
        <Menu.List>
          <Menu.List.Item
            active={active === 'delete'}
            onClick={this.onDeleteClick}>
              Delete
            </Menu.List.Item>
        </Menu.List>
      </Menu>
    )
  }
}

export default withRouter(CommentAdminMenu)
