import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Navbar from 'react-bulma-components/lib/components/navbar'
import { withRouter } from 'react-router-dom'
import { UserContext } from 'components/User/UserProvider'

class NavbarComp extends Component {
  state = { open: false }

  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  goToHome = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/')
  }

  goToProfile = () => {
    const { history } = this.props
    const { sessionUser } = this.context.state
    this.toggleNavbar()
    history.push(`/admin/${sessionUser.username}`)
  }

  signOut = () => {
    const { sessionUser } = this.context.state
    sessionUser.userSession.signUserOut()
    window.location = '/'
  }

  toggleNavbar = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { open } = this.state
    const { sessionUser } = this.context.state
    const isSignedIn = sessionUser.userSession.isUserSignedIn()

    return (
      <Navbar
        color="primary"
        fixed="top"
        active={open}
      >
        <Navbar.Brand>
          <Navbar.Item onClick={this.goToHome}>
            Debut
          </Navbar.Item>

          <Navbar.Burger
            onClick={this.toggleNavbar}
          />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Container position="end">
              {
                isSignedIn &&
                <React.Fragment>
                  <Navbar.Item onClick={this.goToProfile}>
                    My Page
                  </Navbar.Item>

                  <Navbar.Item onClick={this.signOut}>
                    Sign Out
                  </Navbar.Item>
                </React.Fragment>
              }
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
    )
  }
}

export default withRouter(NavbarComp)
NavbarComp.contextType = UserContext
