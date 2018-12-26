import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Table from 'react-bulma-components/lib/components/table'
import './stylesheets/_root.scss'

class RootPage extends Component {
  state = {
    users: []
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get('https://debut-3fcee.firebaseio.com/users.json')
      const users = []

      for (const key in data) {
        users.push({ ...data[key], id: key })
      }

      this.setState({ users })
    } catch (e) {
      console.log(e.message)
    }
  }

  onBoxClick = (user) => {
    const { history } = this.props
    history.push({
      pathname: `/${user.username}`,
      state: {
        identityAddress: user.blockstackId
      }
    })
  }

  render() {
    const { users } = this.state
    return (
      <div className="root-page">
        <Table>
          <tbody>
            {
              _.map(users, (user) => {
                return <tr className="username-table-row" onClick={() => this.onBoxClick(user)}>
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

export default withRouter(RootPage)
