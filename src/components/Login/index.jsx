import React, { Component } from 'react'
import {
  Button,
  Columns,
  Heading,
} from 'components/bulma'
import "./_login.scss"
import logo from 'assets/debut-app-icon-text.svg'

class Login extends Component {
  state = {
    loadingUser: false,
  }

  signIn = (e) => {
    const { userSession } = this.props

    e.preventDefault()
    userSession.redirectToSignIn()
    this.setState({ loadingUser: true })
  }

  render() {
    const { loadingUser } = this.state;

    return (
      <Columns className="login">
        <Columns.Column className="login__column-left" size={6}>
          <div className="login__column-left-blockstack-details">
            <Heading size={2} style={{ color: 'white' }}>
              Debut is powered by Blockstack to help introduce yourself to the community
            </Heading>
            <Heading size={6} style={{ color: 'white'}}>
              Create a profile, introduce yourself, and discover other people's blockstack app's by following them!
            </Heading>

            <Heading size={6} style={{ color: 'white' }}>
              Curious about our roadmap? Click <a href="https://trello.com/b/he3qvtA0/debut" rel="noopener noreferrer" target="_blank">here!</a>
            </Heading>
          </div>
          <div className="login__column-left-blockstack-info">
            <Heading size={6} style={{ color: 'white' }}>
              Questions about blockstack?  Learn more about it <a href="https://blockstack.org/" rel="noopener noreferrer" target="_blank">here!</a>
            </Heading>
          </div>
        </Columns.Column>

        <Columns.Column className="login-column-right" size={6}>
          {
            loadingUser ? <div>Loading...</div> :
            <div className="login-blockstack">
              <img src={logo} alt="Logo" height={250} width={250} />
              <Button
                className="mt-one"
                color="primary"
                onClick={this.signIn}
                >
                Sign in with Blockstack
              </Button>
            </div>
          }
        </Columns.Column>
      </Columns>
    );
  }
}

export default Login;
