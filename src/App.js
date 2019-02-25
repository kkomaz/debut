// Library imports
import React, { Component } from 'react'
import { UserSession } from 'blockstack'

// Utility Imports
import { appConfig } from 'utils/constants'
import RootRoute from 'routes/RootRoute'
import { User } from 'radiks';
import { forceUserSignOut } from 'utils/auth'

// Component/Styles Imports
import Login from 'components/Login'
import 'stylesheets/main.scss'

class App extends Component {
  state = {
    userSession: new UserSession({ appConfig }),
    loggedIn: false,
    loggingIn: false,
  }

  componentDidMount = async () => {
    const { userSession } = this.state

    if (userSession.isUserSignedIn()) {
      this.setState({ loggedIn: true })
    }

    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn()
      this.setState({ loggingIn: true })

      if (!userData.username) {
        return forceUserSignOut(userSession,
          'This app requires a username!  Please go back to the Blockstack browser and register a username! Signing out in 5 seconds...'
        )
      }

      const user = User.currentUser()
      await user.fetch({ decrypt: false })

      try {
        await User.createWithCurrentUser()
      } catch (e) {
        console.log(e.message)
      }

      return this.setState({
        loggedIn: true,
        loggingIn: false
      })
    }
  }

  render() {
    const { userSession } = this.state

    return (
      <div className="App">
        {
          this.state.loggedIn ?
          <RootRoute userSession={userSession} /> :
          <Login
            userSession={userSession}
            loggingIn={this.state.loggingIn}
          />
        }
      </div>
    );
  }
}

export default App;
