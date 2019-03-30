import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Columns,
  Heading,
  Content,
} from 'components/bulma'
import "./_login.scss"
import debutInfo from 'assets/debut_info.png'
import { Loader } from 'components/Loader'

class Login extends Component {
  state = {
    loadingUser: false,
  }

  static propTypes = {
    loggingIn: PropTypes.bool.isRequired,
  }

  signIn = (e) => {
    const { userSession } = this.props

    e.preventDefault()
    userSession.redirectToSignIn()
    this.setState({ loadingUser: true })
  }

  render() {
    const { loadingUser } = this.state;
    const { loggingIn } = this.props

    if (loggingIn) {
      return (
        <Loader
          cardWrapped
          contained
          text="Logging user in...."
        />
      )
    }

    return (
      <Columns className="login">
        <Columns.Column className="login__column-right" size={12}>
          {
            loadingUser ? <div>Loading...</div> :
            <div className="login-blockstack">
              <Heading size={2} style={{ marginTop: '30px'}}>debut</Heading>
              <img className="mb-one" src={debutInfo} alt="Logo" height={600} width={600} />
                <Content className="login__sign-in-content">
                  <Button
                    className="mt-half login__button-sign-in"
                    color="link"
                    onClick={this.signIn}
                  >
                    Sign in with Blockstack
                  </Button>
                </Content>
                <Heading size={6}>
                  <a href="https://landing.debutapp.social" rel="noopener noreferrer" target="_blank">About debut</a>
                </Heading>

                <Heading size={6}>
                  Curious about our technical roadmap? Click <a href="https://trello.com/b/he3qvtA0/debut" rel="noopener noreferrer" target="_blank">here.</a>
                </Heading>
            </div>
          }
        </Columns.Column>
      </Columns>
    );
  }
}

export default Login;
