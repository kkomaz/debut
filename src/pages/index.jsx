import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Columns,
  Media,
} from 'components/bulma'
import { UserContext } from 'components/User/UserProvider'
import './Page.scss'
import { requestUserIntro } from 'actions/blockstack'

class Page extends Component {
  // TODO: Commented out but might need later
  // componentDidMount = async () => {
  //   const { sessionUser } = this.context.state
  //   const { userState } = this.props;
  //
  //   _.each(userState.users, (user) => {
  //     console.log(user)
  //     this.props.requestUserIntro(user.username, sessionUser.userSession)
  //   })
  // }

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
    const { defaultImgUrl } = this.context.state

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
                  <Card style={{ cursor: 'pointer', backgroundColor: '#401457', color: 'white' }} onClick={() => this.onBoxClick(user)}>
                    <Card.Image size="4by3" src={_.get(user, 'profile.image[0].contentUrl', defaultImgUrl)} />
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
