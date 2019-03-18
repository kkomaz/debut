import React, { Component } from 'react'
import axios from 'axios'
import {
  Card,
  Heading,
} from 'components/bulma'
import { IconListUsers } from 'components/icon'

class RandomUsers extends Component {
  state = {
    users: []
  }

  componentDidMount = async() => {
    const { data } = await axios.get('/users/random')
    return this.setState({ users: data.users })
  }

  render() {
    const { users } = this.state

    return (
      <Card>
        <Card.Content>
          <Heading size={4}>Signed up users on debut</Heading>
          <IconListUsers users={users} />
        </Card.Content>
      </Card>
    )
  }
}

export default RandomUsers
