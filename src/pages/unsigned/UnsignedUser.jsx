import React, { Component } from 'react'
import {
  Card,
  Columns,
  Content,
  Heading
} from 'components/bulma'
import PropTypes from 'prop-types'
import './UnsignedUser.scss'
import unsignedUserImage from 'assets/unsigned-user.png'
import { lookupProfile } from 'blockstack'

class UnsignedUsers extends Component {
  async componentDidMount() {
    const { match } = this.props
    const username = match.params.username

    const result = await lookupProfile(username)
    console.log(result.account)
  }
  render() {
    return (
      <Card className="unsigned-users">
        <Card.Content>
          <Content>
            <Columns>
              <Columns.Column size={6}>
                <img src={unsignedUserImage} alt="Logo" height={1000} width={1000} />
              </Columns.Column>
              <Columns.Column size="6" className="no-users__text-column">
                <div className="no-users__more-info">
                  <Heading size={5}>
                    No more users in debut!
                  </Heading>
                  <Heading size={5}>
                    Tweet out and let others know about the community!
                  </Heading>
                </div>
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

UnsignedUsers.propTypes = {
  loading: PropTypes.bool.isRequired,
  full: PropTypes.bool.isRequired
}

export default UnsignedUsers
