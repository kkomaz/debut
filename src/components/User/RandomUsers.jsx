// Library Imports
import React, { Component } from 'react'
import axios from 'axios'

// Component Imports
import {
  Card,
  Heading,
} from 'components/bulma'
import { IconListUsers } from 'components/icon'

// Stylsheets
import './RandomUsers.scss'

class RandomUsers extends Component {
  state = {
    users: [],
  }

  componentDidMount = () => {
    this.fetchRandomUsers()
  }

  onRefreshClick = () => {
    this.setState({ users: [] }, this.fetchRandomUsers)
  }

  fetchRandomUsers = async () => {
    const { data } = await axios.get('/users/random')
    return this.setState({
      users: data.users,
    })
  }

  render() {
    const { users } = this.state

    return (
      <Card className="random-users" style={{ height: '280px' }}>
        <Card.Content>
          <div className="random-users__content mb-one">
            <div className="random-users__title-container">
              <Heading className="random-users__header" size={6}>Signed up users on debut</Heading>
              <Heading size={6}>· </Heading>
            </div>
            <div className="random-users__refresh-container ml-half">
              <p className="small random-users__refresh" onClick={this.onRefreshClick}>Refresh</p>
              <p className="ml-quarter">· </p>
            </div>
            <div className="random-users__view-all-container">
              <p className="small random-users__view-all">View All</p>
            </div>
          </div>
          <IconListUsers users={users} />
        </Card.Content>
      </Card>
    )
  }
}

export default RandomUsers
