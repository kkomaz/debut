import React, { Component } from 'react'
import {
  Card,
  Columns,
  Content,
  Heading
} from 'components/bulma'
import PropTypes from 'prop-types'
import './NoUsers.scss'
import glasses from 'assets/glasses.png'

class NoUsers extends Component {
  componentDidMount() {
    window.twttr.widgets.load()
  }

  render() {
    return (
      <Card className="no-users">
        <Card.Content>
          <Content>
            <Columns>
              <Columns.Column size={6}>
                <img src={glasses} alt="Logo" height={1000} width={1000} />
              </Columns.Column>
              <Columns.Column size="6" className="no-users__text-column">
                <div className="no-users__more-info">
                  <Heading size={5}>
                    No more users in Debut!
                  </Heading>
                  <Heading size={5}>
                    Tweet out and let others know about the community!
                  </Heading>
                  <a
                    className="twitter-share-button"
                    href="https://twitter.com/intent/tweet?text=Join%20me%20and%20introduce%20yourself%20to%20the%20decentralized%20community%20and%20take%20ownership%20of%20your%20data!&url=my_url&via=debutDapp&related=debutDapp"
                    data-size="large"
                  >
                    Tweet
                  </a>
                </div>
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

NoUsers.propTypes = {
  loading: PropTypes.bool.isRequired,
  full: PropTypes.bool.isRequired
}

export default NoUsers
