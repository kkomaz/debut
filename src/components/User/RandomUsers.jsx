import React, { Component } from 'react'
import axios from 'axios'
import {
  Card,
  Heading,
} from 'components/bulma'

class RandomUsers extends Component {
  state = {
    users: []
  }

  componentDidMount = async() => {
    const { data } = axios.get('/users/random')
    console.log(data)
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Heading size={6}>Signed up users on debut</Heading>
        </Card.Content>
      </Card>
    )
  }
}

export default RandomUsers
