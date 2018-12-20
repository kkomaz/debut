import React, { Component } from 'react'

// first we will make a new context
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
      }
    }
  }

  render() {
    return (
      <UserContext.Provider value={{
        state: this.state
      }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserProvider
