import React, { Component } from 'react'
import {
  Card,
  Columns,
  Content,
  Container,
} from 'components/bulma'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Icon } from 'components/icon'
import './UnsignedUser.scss'
import unsignedUserImage from 'assets/unsigned-user.png'
import { lookupProfile } from 'blockstack'
import { User } from 'radiks'

const keys = {
  twitter: {
    icon: 'IconTwitter',
    url: 'https://twitter.com'
  },
  facebook: {
    icon: 'IconFacebook',
    url: 'https://facebook.com'
  },
  github: {
    icon: 'IconGithub',
    url: 'https://github.com'
  },
  linkedIn: {
    icon: 'IconLinkedIn',
    url: 'https://www.linkedin.com/in'
  }
}

class UnsignedUsers extends Component {
  state = {
    userProofs: [],
    nonBlockstackId: false,
    twitterLoaded: false,
  }

  async componentDidMount() {
    const { match, history } = this.props
    const username = match.params.username

    // Initial Radiks check -- if true - redirect
    const radiksCheck = await User.findOne({ username }) // Tell Hank about User.findById() works with any Id
    if (radiksCheck) {
      return history.push(`/${username}`)
    }

    // Lookup Profile
    try {
      const result = await lookupProfile(username)
      const allowableProofs = ['facebook', 'twitter', 'github', 'linkedIn']
      const userProofs = _.filter(result.account, (account) => _.includes(allowableProofs, account.service))
      this.setState({ userProofs })
    } catch (e) {
      this.setState({ nonBlockstackId: true })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.twttr.widgets && !this.state.twitterLoaded) {
      window.twttr.widgets.load()
      this.setState({ twitterLoaded: true })
    }
  }

  render() {
    const { userProofs, nonBlockstackId } = this.state
    const { username } = this.props.match.params

    return (
      <Container>
        <Card className="unsigned-user">
          <Card.Content>
            <Content>
              <Columns>
                <Columns.Column size={6}>
                  <img src={unsignedUserImage} alt="Logo" height={1000} width={1000} />
                </Columns.Column>
                <Columns.Column size={6} className="unsigned-user__text-column">
                  <div className="unsigned-user__more-info">
                    {
                      nonBlockstackId ?
                      <div className="unsigned-user__invalid-blockstack-id">
                        <div className="mb-one">
                          <strong>{username}</strong> is not a valid blockstack id! Let others know about blockstack and invite them to debut!
                        </div>
                        <a
                          className="twitter-share-button"
                          href="https://twitter.com/intent/tweet?text=Join%20me%20and%20introduce%20yourself%20to%20the%20decentralized%20community%20and%20take%20ownership%20of%20your%20data!&url=my_url&via=the_debut_app &related=the_debut_app"
                          data-size="large"
                        >
                          Tweet
                        </a>
                      </div> :
                      <div className="unsigned-user__invalid-debut-id">
                        <p>
                          <strong>{username}</strong> is a blockstack user but is <strong>not</strong> using debut!  Let the user know about debut via social proofs below!
                        </p>
                        <p>
                          If no social proofs exists, you can always use the Blockstack explorer located <a href={`https://explorer.blockstack.org/name/${username}`} rel="noopener noreferrer" target="_blank">here!</a>
                        </p>
                        <div className="mt-one">
                          {
                            _.map(userProofs, (proof) => {
                              return (
                                <Icon
                                  key={proof.service}
                                  className="debut-icon debut-icon--pointer mr-half"
                                  icon={keys[`${proof.service}`].icon}
                                  onClick={() => window.open(`${keys[`${proof.service}`].url}/${proof.identifier}`)}
                                  size={32}
                                />
                              )
                            })
                          }
                        </div>
                      </div>
                    }
                  </div>
                </Columns.Column>
              </Columns>
            </Content>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

UnsignedUsers.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(UnsignedUsers)
