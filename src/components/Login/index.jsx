import React, { Component } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Columns from 'react-bulma-components/lib/components/columns'
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
        <Columns.Column className="login-column-left" size={6}>
        </Columns.Column>

        <Columns.Column className="login-column-right" size={6}>
          {
            loadingUser ? <div>Loading...</div> :
            <div className="login-blockstack">
              <img src={logo} alt="Logo" height={250} width={250} />
              <Button
                color="primary mt-one"
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
