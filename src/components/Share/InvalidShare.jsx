import React, { Component } from 'react'
import {
  Card,
  Columns,
  Content,
  Heading
} from 'components/bulma'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './InvalidShare.scss'
import error from 'assets/error.jpg'

class InvalidShares extends Component {
  onClick = () => {
    const { history, username } = this.props

    return history.push(`/${username}`)
  }

  render() {
    const { username } = this.props
    return (
      <Card className="invalid-share">
        <Card.Content>
          <Content>
            <Columns>
              <Columns.Column size={6}>
                <img src={error} alt="Logo" height={1000} width={1000} />
              </Columns.Column>
              <Columns.Column size={6} className="invalid-share__text-column">
                <div className="invalid-share__more-info">
                  <Heading size={3}>Oh no!  How did you get here?</Heading>
                  <Heading size={6}>
                    This shared moment does not exist!
                  </Heading>
                  <Heading size={6}>
                    You can go back to <span onClick={this.onClick} className="invalid-share__username">{`${username}'s`}</span> profile in the meantime!
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

InvalidShares.propTypes = {
  loading: PropTypes.bool.isRequired,
  full: PropTypes.bool.isRequired
}

export default withRouter(InvalidShares)
