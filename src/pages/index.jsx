import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Columns,
  Content,
  Heading,
  Image,
  Media,
  Table
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import './Page.scss'

class Page extends Component {
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
    const { userState } = this.props

    return (
      <div className="page">
        <Columns breakpoint="tablet">
          {
            _.map(userState.users, (user) => {
              return (
                <Columns.Column
                  key={user.username}
                  tablet={{
                    size: 3
                  }}
                >
                  <Card style={{ cursor: 'pointer' }} onClick={() => this.onBoxClick(user)}>
                    <Card.Content style={{ height: '100px' }}>
                      <Media>
                        <Media.Item style={{ textAlign: 'center' }}>
                          <p>{user.username}</p>
                          <p>joined debut!</p>
                        </Media.Item>
                      </Media>
                    </Card.Content>
                  </Card>
                </Columns.Column>
              )
            })
          }
        </Columns>
        <Table>
          <tbody>
            {
              _.map(userState.users, (user) => {
                return <tr key={user.username} className="page__user-row" onClick={() => this.onBoxClick(user)}>
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
    userState: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(Page))
Page.contextType = UserContext
