import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import './UserList.scss'

class UserList extends Component {
  static propTypes = {
    users: PropTypes.array
  }

  onClick = (username) => {
    const { history } = this.props

    history.push(`/${username}`)
  }

  render() {
    const { users } = this.props

    return (
      <ul className="user-list">
        {
          _.map(users, (user) => {
            return (
              <li className="user-list__single" key={user.username}>
                <img
                  src={user.imageUrl}
                  alt="dapp"
                  height="42"
                  width="42"
                  onClick={() => this.onClick(user.username)}
                />
              </li>
            )
          })
        }
      </ul>
    )
  }
}

export default UserList
