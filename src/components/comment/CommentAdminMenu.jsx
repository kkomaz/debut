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
      active: props.onEditClick ? 'edit' : 'delete'
    }
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    share: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
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
          className="comment-admin-menu"
          style={{
            backgroundColor: '#383A3F',
            padding: '15px',
            width: '120px',
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

    return (
      <Menu
        className="share-admin-menu"
        style={{
          backgroundColor: '#383A3F',
          padding: '20px',
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
