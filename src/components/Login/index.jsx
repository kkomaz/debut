import React, { Component } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Columns from 'react-bulma-components/lib/components/columns'
import debut from 'images/debut.png'
import "./_login.scss"

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
      <Columns className="login" gapless>
        <Columns.Column className="login-column-left" size={6}>
        </Columns.Column>

        <Columns.Column className="login-column-right" size={6}>
          {
            loadingUser ? <div>Loading...</div> :
            <div className="login-blockstack">
              <img src={debut} alt="Logo" />
              <Button
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
