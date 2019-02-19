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
      console.log('logging in via localStorage save')
      this.setState({ loggedIn: true })
    }

    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      console.log('initiate handle pending sign in')
      const userData = await userSession.handlePendingSignIn()
      const user = User.currentUser()
      await user.fetch({ decrypt: false })
      console.log(user.attrs, 'user.attrs')

      console.log('userData here!')
      console.log(userData)

      try {
        await User.createWithCurrentUser()
      } catch (e) {
        console.log(e.message)
      }

      console.log('createdCurrentUser!')

      if (!userData.username) {
        throw new Error('This app requires a username')
      }

      console.log('logging in via pending sign in')

      this.setState({ loggedIn: true })
    } else {
      console.log('not loggin in')
    }
  }

  componentDidUpdate() {
    const { userSession, loggedIn } = this.state

    if (!loggedIn && userSession.isUserSignedIn()) {
      console.log('hitting the componentDidUpdate')
      this.setState({ loggedIn: true })
    }
  }

  render() {
    const { userSession } = this.state

    console.log(this.state.loggedIn)

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
