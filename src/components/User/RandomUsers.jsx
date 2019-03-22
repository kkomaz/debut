// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

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

  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  componentDidMount = () => {
    this.fetchRandomUsers()
  }

  onRefreshClick = () => {
    this.setState({ users: [] }, this.fetchRandomUsers)
  }

  onExploreClick = () => {
    const { history } = this.props

    return history.push('/explore')
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
        <Card.Content className="random-users__card-content">
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
              <p className="small random-users__view-all" onClick={this.onExploreClick}>View All</p>
            </div>
          </div>
          <IconListUsers users={users} />
        </Card.Content>
      </Card>
    )
  }
}

export default withRouter(RandomUsers)
