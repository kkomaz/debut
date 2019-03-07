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
    userSession: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    const { userSession, history } = this.props
    if (userSession.username !== 'kkomaz.id') {
      history.push('/')
    }

    try {
      const users = await User.fetchList()
      this.setState({ users: _.map(users, 'attrs') })
    } catch (e) {
      console.log(e)
    }
  }

  updateFollowers = (user) => {
    console.log(user)
  }

  updateFollowing = async () => {
    const { users } = this.state
    const { userSession } = this.props

    for (let i = 0; i < users.length; i++) {
      const options = { decrypt: false, username: users[i].username }
      const following = await userSession.getFile(`users-following-${users[i].username}.json`, options)
      if (!following) {
        const follow = new Follow({
          username: users[i].username,
          followers: [],
          followersCount: 0,
          following: [],
          followingCount: 0,
        })
        await follow.save()
      } else {
        const followingParsed = JSON.parse(following)
        const result = _.map(followingParsed, 'username')

        const follow = new Follow({
          username: users[i].username,
          followers: [],
          followersCount: 0,
          following: result,
          followingCount: result.length,
        })
        await follow.save()
      }
    }
  }

  updateFollowers = async () => {
    const { users } = this.state

    for (let i = 0; i < users.length; i++) {
      const follow = await Follow.findOne({ username: users[i].username })

      if (!follow) {
        debugger
        console.log('ignoring bad user')
      } else {
        const following = follow.attrs.following
        for (let j = 0; j < following.length; j++) {
          const secondFollow = await Follow.findOne({ username: following[j].username})
          if (!secondFollow) {
            debugger
            console.log('ignoring bad user')
          } else {
            const followers = [...secondFollow.attrs.followers, users[i].username]
            secondFollow.update({
              followers,
              followersCount: followers.length
            })
            await secondFollow.save()
          }
        }
      }
    }
  }

  updateUserFollowers = async (username) => {
    const follow = await Follow.findOne({ username })
    const following = follow.attrs.following

    for (let i = 0; i < following.length; i++) {
      const follow = await Follow.findOne({ username: following[i]})
      const followers = follow.attrs.followers
      const newFollowers = [...followers, username]

      follow.update({
        followers: newFollowers,
        followersCount: newFollowers.length
      })
      await follow.save()
    }
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
                    <Button className="ml-one" onClick={() => this.updateUserFollowers(user.username)}>Update user followers</Button>
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
