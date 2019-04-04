// Library imports
/** @jsx jsx */
import { Component } from 'react'
import { jsx } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'
import { UserSession } from 'blockstack'
import _ from 'lodash'
import 'focus-visible/dist/focus-visible.js'

// Utility Imports
import { appConfig } from 'utils/constants'
import RootRoute from 'routes/RootRoute'
import debutUser from 'model/debutUser'
import { User } from 'radiks'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Follow from 'model/follow'
import { colors } from 'utils/colors'

// Component/Styles Imports
import Login from 'components/Login'
import 'stylesheets/main.scss'
import 'emoji-mart/css/emoji-mart.css'

const theme = {
  colors,
}

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

    // If already signed in
    if (userSession.isUserSignedIn()) {
      this.setState({ loggedIn: true }, async () => {
        const userData = userSession.loadUserData()
        const radiksUser = await User.findOne({ username: userData.username })

        if (radiksUser && !radiksUser.attrs.radiksSignature) {
          await User.createWithCurrentUser()
        }
      })
    }

    // If pending sign-in
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

        if (radiksUser && !radiksUser.attrs.radiksSignature) {
          await User.createWithCurrentUser()
        }

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
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    );
  }
}

export default App
