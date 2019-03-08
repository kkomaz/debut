import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Navbar from 'react-bulma-components/lib/components/navbar'
import { Input, Dropdown } from 'components/bulma'
import { withRouter } from 'react-router-dom'
import { UserContext } from 'components/User/UserProvider'
import axios from 'axios'
import './Navbar.scss';

class NavbarComp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      searchedUser: '',
      searchResults: [],
      selected: ''
    }

    this.fetchList = _.debounce(this.fetchList, 300)
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    setProfileClickedTrue: PropTypes.func.isRequired,
    setHomePageClickedTrue: PropTypes.func.isRequired,
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
    this.props.setProfileClickedTrue()
    history.push(`/${sessionUser.username}`)
  }

  goToHelp = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/help')
  }

  onChange = (e) => {
    e.preventDefault()
    if (!this.dropdown.state.open) {
      this.dropdown.toggle()
    }

    this.setState({ searchedUser: e.target.value })
    this.fetchList(e.target.value)
  }

  onDropdownChange = (selected) => {
    const { history } = this.props

    this.setState({
      searchedUser: selected,
      selected,
    }, () => {
      history.push(`/${selected}`)
    })
  }

  fetchList = async (searched) => {
    const { data } = await axios.get(`https://core.blockstack.org/v1/search?query=${searched}`)
    const result = _.map(data.results, 'fullyQualifiedName')
    this.setState({ searchResults: result })
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
    const { open, searchResults } = this.state
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

          <Navbar.Item>
            <Input
              onChange={this.onChange}
              value={this.state.searchedUser}
              placeholder="Search for debut user"
            />
            <Dropdown
              ref={(dropdown) => this.dropdown = dropdown }
              value={this.state.selected}
              color="info"
              onChange={this.onDropdownChange}
            >
              {
                _.map(searchResults, (username) => {
                  return <Dropdown.Item onClick={() => console.log('hi')} value={username}>{username}</Dropdown.Item>
                })
              }
            </Dropdown>
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
                  <Navbar.Item onClick={this.goToHelp}>
                    Help
                  </Navbar.Item>
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
