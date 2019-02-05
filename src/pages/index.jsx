import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Table from 'react-bulma-components/lib/components/table'
import './stylesheets/_root.scss'

class RootPage extends Component {
  onBoxClick = (user) => {
    const { history } = this.props

    return history.push({
      pathname: `/${user.username}`,
      state: {
        identityAddress: user.blockstackId
      }
    })
  }

  render() {
    const { users } = this.props

    return (
      <div className="root-page">
        <Table>
          <tbody>
            {
              _.map(users, (user) => {
                return <tr key={user.username} className="username-table-row" onClick={() => this.onBoxClick(user)}>
                  <td>{user.username} has joined debut!</td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users
  }
}

export default withRouter(connect(mapStateToProps)(RootPage))
