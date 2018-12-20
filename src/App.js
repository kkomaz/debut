import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import { Button } from 'react-bulma-components'
import { appConfig } from 'utils/constants'
import Login from 'components/Login'
import 'stylesheets/main.scss'

class App extends Component {
  state = {
    userSession: new UserSession({ appConfig })
  }

  componentDidMount = async () => {
    const { userSession } = this.state

    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn()

      if (!userData.username) {
        throw new Error('This app requires a username')
      }
      window.location = '/'
    }
  }

  render() {
    const { userSession } = this.state

    console.log(userSession.isUserSignedIn())

    return (
      <div className="App">
        {
          userSession.isUserSignedIn() ?
          <div><Button onClick={() => userSession.signUserOut()}>Sign Out</Button></div> :
          <Login userSession={userSession} />
        }
      </div>
    );
  }
}

export default App;
