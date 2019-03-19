// Library imports
import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import _ from 'lodash'

// Utility Imports
import { appConfig } from 'utils/constants'
import RootRoute from 'routes/RootRoute'
import debutUser from 'model/debutUser'
import { User } from 'radiks'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Follow from 'model/follow'

// Component/Styles Imports
import Login from 'components/Login'
import 'stylesheets/main.scss'

class App extends Component {
  constructor(props) {
    super(props)

    const userSession = new UserSession({ appConfig })

    this.state = {
      userSession,
      loggedIn: false,
      loggingIn: false,
    }
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
        return this.setState({
          loggedIn: true
        })
      }

      const user = debutUser.currentUser()
      await user.fetch({ decrypt: false })

      try {
        const radiksUser = await User.findOne({ username: userData.username })

        if (!radiksUser) {
          const currentUser = await User.createWithCurrentUser()
          const profileImgUrl = _.get(currentUser, 'attrs.profile.image[0].contentUrl', null)
          if (profileImgUrl) {
            currentUser.update({
              profileImgUrl,
            })
            await currentUser.save()
          }

          const follow = new Follow({
            username: currentUser._id,
            followers: [],
            followersCount: 0,
            following: [],
            followingCount: 0,
          })
          await follow.save()
        }
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
        <ToastContainer className='toast-container' />
        {
          this.state.loggedIn ?
          <RootRoute
            userSession={userSession}
          /> :
          <Login
            userSession={userSession}
            loggingIn={this.state.loggingIn}
          />
        }
      </div>
    );
  }
}

export default App
