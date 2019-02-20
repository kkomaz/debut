import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import { appConfig } from 'utils/constants'
import Login from 'components/Login'
import RootRoute from 'routes/RootRoute'
import { User } from 'radiks';
import 'stylesheets/main.scss'

class App extends Component {
  state = {
    userSession: new UserSession({ appConfig }),
    loggedIn: false,
  }

  componentDidMount = async () => {
    const { userSession } = this.state

    if (userSession.isUserSignedIn()) {
      this.setState({ loggedIn: true })
    }

    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn()
      const user = User.currentUser()
      await user.fetch({ decrypt: false })

      try {
        await User.createWithCurrentUser()
      } catch (e) {
        console.log(e.message)
      }

      if (!userData.username) {
        throw new Error('This app requires a username')
      }

      this.setState({ loggedIn: true })
    }
  }

  render() {
    const { userSession } = this.state

    return (
      <div className="App">
        {
          this.state.loggedIn ?
          <RootRoute userSession={userSession} /> :
          <Login userSession={userSession} />
        }
      </div>
    );
  }
}

export default App;
