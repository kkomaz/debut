import React, { Component } from 'react'

// first we will make a new context
export const MyContext = React.createContext();

class UserProvider extends Component {
  constructor(props) {
    super(props)

    const userData = props.userSession.loadUserData()

    this.state = {
      currentUser: {
        userSession: props.userSession,
        userData,
        username: userData.username,
      }
    }
  }

  render() {
    return (
      <MyContext.Provider value={{
        state: this.state
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

export default UserProvider
