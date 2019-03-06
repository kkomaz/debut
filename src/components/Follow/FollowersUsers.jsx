import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Columns,
  Container,
  Card,
} from 'components/bulma'
import PropTypes from 'prop-types'
import { User } from 'radiks'
import _ from 'lodash'
import { UserContext } from 'components/User/UserProvider'

class FollowersUsers extends Component {
  state = {
    offset: 0,
    users: [],
  }

  static propTypes = {
    follow: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func.isRequired,
  }

  componentDidMount = async () => {
    this.fetchUsers()
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.follow.username !== prevProps.follow.username) {
      this.setState({ users: [], offset: 0 }, () => {
        this.fetchUsers()
      })
    }

    if (this.props.follow.username === prevProps.follow.username) {
      const { sessionUser } = this.context.state

      if (this.props.follow.followerCount > prevProps.follow.followerCount) {
        const user = await User.findOne({ username: sessionUser.username })
        const users = [...this.state.users, user.attrs]
        this.setState({
          users,
          offset: users.length
        })
      }

      if (this.props.follow.followerCount < prevProps.follow.followerCount) {
        const users = _.filter(this.state.users, (user) => user._id !== sessionUser.username)
        this.setState({
          users,
          offset: users.length
        })
      }
    }
  }

  fetchUsers = async () => {
    const { follow } = this.props
    const { offset } = this.state

    if (_.get(follow, 'followers.length', 0) > 0) {
      const result = await User.fetchList({
        username: follow.followers,
        sort: '-createdAt',
        limit: 10,
        offset,
      })

      this.setState({
        users: _.map(result, 'attrs'),
        offset: result.length
      })
    }
  }

  onBoxClick = (user) => {
    const { history } = this.props
    this.props.setActiveTab('profile')
    history.push(`/${user.username}`)
  }

  render() {
    const { users } = this.state
    const { defaultImgUrl } = this.context.state
    const { className } = this.props

    return (
      <Container>
        <Columns className={className} breakpoint="tablet" style={{ padding: '0 150px' }}>
          {
            _.map(users, (user) => {
              return (
                <Columns.Column
                  key={user.username}
                  tablet={{
                    size: 3,
                  }}
                >
                  <Card className="page__card" onClick={() => this.onBoxClick(user)}>
                    <Card.Image size="4by3" src={_.get(user, 'profileImgUrl', defaultImgUrl)} />
                    <Card.Content className="page__content">
                      <p className="page__username-text">{user.username}</p>
                    </Card.Content>
                  </Card>
                </Columns.Column>
              )
            })
          }
        </Columns>
      </Container>
    )
  }
}

export default withRouter(connect()(FollowersUsers))
FollowersUsers.contextType = UserContext
