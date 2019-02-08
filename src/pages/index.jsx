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
import { requestUserIntro } from 'actions/blockstack'

class Page extends Component {
  componentDidMount() {
    const { sessionUser } = this.context.state
    const { userState } = this.props;

    _.each(userState.users, (user) => {
      console.log(user)
      this.props.requestUserIntro(user.username, sessionUser.userSession)
    })
  }

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

export default withRouter(connect(mapStateToProps, {
  requestUserIntro,
})(Page))
Page.contextType = UserContext
