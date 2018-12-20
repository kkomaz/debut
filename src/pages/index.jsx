import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import {
  Section,
  Box,
  Media,
  Content
} from 'react-bulma-components'
import './stylesheets/_root.scss'

class RootPage extends Component {
  state = {
    users: []
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get('https://debut-3fcee.firebaseio.com/users.json')
      const users = []

      for (const key in data) {
        users.push({ ...data[key], id: key })
      }

      this.setState({ users })
    } catch (e) {
      console.log(e.message)
    }
  }

  onBoxClick = (user) => {
    const { history } = this.props
    history.push({
      pathname: `/${user.username}`,
      state: {
        userAddress: user.blockstackId
      }
    })
  }

  render() {
    const { users } = this.state
    return (
      <Section className="root-page">
        {
          _.map(users, (user) => {
            return (
              <Box className="root-page__box" onClick={() => this.onBoxClick(user)}>
                <Media>
                  <Media.Item>
                    <Content>
                      <p>
                        <strong>{user.username} </strong>
                        <span>has joined debut!</span>
                      </p>
                    </Content>
                  </Media.Item>
                </Media>
              </Box>
            )
          })
        }
      </Section>
    )
  }
}

export default withRouter(RootPage)
