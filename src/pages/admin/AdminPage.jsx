import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/bulma'
import { withRouter } from 'react-router-dom'
import { User } from 'radiks'
import Follow from 'model/follow'
import _ from 'lodash'

class AdminPage extends Component {
  state = {
    users: []
  }

  static propTypes = {
    username: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    const { username, history } = this.props
    if (username !== 'kkomaz.id') {
      history.push('/')
    }

    try {
      const users = await User.fetchList()
      this.setState({ users: _.map(users, 'attrs') })
    } catch (e) {
      console.log(e)
    }
  }

  updateFollowing = async () => {
    const { users } = this.state

    for (let i = 0; i < users.length; i++) {
      const follow = new Follow({
        username: users[i].username,
        followers: [],
        followersCount: 0,
        following: [],
        followingCount: 0,
      })
      await follow.save()
    }
  }

  updateFollowingOfUser = async (username) => {
    const follow = new Follow({
      username: username,
      followers: [],
      followersCount: 0,
      following: [],
      followingCount: 0,
    })
    await follow.save()
  }

  render() {
    return (
      <div className="admin-page">
        <Button onClick={this.updateFollowing} color="primary">
          Update Following
        </Button>
        <Button onClick={this.updateFollowers}>
          Update Followers
        </Button>
        <ul>
          {
            _.map(this.state.users, (user) => {
              return (
                <React.Fragment>
                  <div style={{ display: 'flex', marginBottom: '5px' }}>
                    <li>{user.username}</li>
                    <Button className="ml-one" onClick={() => this.updateFollowingOfUser(user.username)}>Update following</Button>
                  </div>
                </React.Fragment>
              )
            })
          }
        </ul>
      </div>
    )

  }
}

export default withRouter(AdminPage)
