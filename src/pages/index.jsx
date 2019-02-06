import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  Columns,
  Content,
  Heading,
  Image,
  Media,
  Table
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import { User } from 'radiks';
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

  doRadiks = async () => {
    console.log('hitting here')
    User.fetchList()
  }

  render() {
    const { userState } = this.props

    return (
      <div className="page">
        <Button onClick={this.doRadiks}>
          Click me
        </Button>
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
