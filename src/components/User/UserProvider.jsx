import React, { Component } from 'react'
export const UserContext = React.createContext();

class UserProvider extends Component {
  constructor(props) {
    super(props)

    const userData = props.userSession.loadUserData()

    this.state = {
      sessionUser: {
        userSession: props.userSession,
        userData,
        username: userData.username,
        following: [],
      },
      defaultImgUrl: 'https://i.imgur.com/w1ur3Lq.jpg'
    }
  }

  componentDidMount = async () => {
    const { sessionUser } = this.state

    try {
      const options = { decrypt: false }
      const response = await sessionUser.userSession.getFile(`users-following-${sessionUser.username}.json`, options)
      if (!response) {
        throw new Error('File does not exist')
      }
      this.setState({
        sessionUser: {
          ...this.state.sessionUser, following: JSON.parse(response)
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  setSessionUserState = (key, value) => {
    const result = { ...this.state.sessionUser, [key]: value }
    this.setState({ sessionUser: result })
  }

  render() {
    return (
      <UserContext.Provider value={{
        state: this.state,
        setSessionUserState: this.setSessionUserState
      }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserProvider
