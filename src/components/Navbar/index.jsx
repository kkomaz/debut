import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Navbar from 'react-bulma-components/lib/components/navbar'
import { withRouter } from 'react-router-dom'
import { UserContext } from 'components/User/UserProvider'
import './Navbar.scss';

class NavbarComp extends Component {
  state = {
    open: false
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  goToHome = () => {
    const { history } = this.props
    this.props.setHomePageClickedTrue()
    history.push('/')
  }

  goToProfile = () => {
    const { history } = this.props
    const { sessionUser } = this.context.state
    this.toggleNavbar()
    history.push(`/${sessionUser.username}`)
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
        className="debut-nav-bar"
        color="primary"
        fixed="top"
        active={open}
      >
        <Navbar.Brand>
          <Navbar.Item onClick={this.goToHome}>
            debut
          </Navbar.Item>

          <Navbar.Burger
            onClick={this.toggleNavbar}
          />
        </Navbar.Brand>
        <Navbar.Menu className="debut-nav-bar__menu">
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
