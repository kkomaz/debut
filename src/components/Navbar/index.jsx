/** @jsx jsx */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core'
import _ from 'lodash'
import { connect } from 'react-redux'
import Navbar from 'react-bulma-components/lib/components/navbar'
import { Input, Dropdown, Container } from 'components/bulma'
import { IconLoader } from 'components/Loader'
import { withRouter } from 'react-router-dom'
import { UserContext } from 'components/User/UserProvider'
import axios from 'axios'
import NavbarList from './NavbarList'
import './Navbar.scss';

class NavbarComp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      searchedUser: '',
      searchResults: [],
      selected: '',
      hovered: '',
    }

    this.fetchList = _.debounce(this.fetchList, 300)
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    setProfileClickedTrue: PropTypes.func.isRequired,
    setHomePageClickedTrue: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.dropdown.state.open) {
      document.addEventListener('keydown', this.onKeyPress, false)
    }

    if (!this.dropdown.state.open) {
      document.removeEventListener('keydown', this.onKeyPress)
    }
  }

  goToHome = () => {
    const { history } = this.props
    this.props.setHomePageClickedTrue()
    history.push('/')
  }

  goToProfile = () => {
    const { history } = this.props
    const { sessionUser } = this.context.state
    this.props.setProfileClickedTrue()
    this.toggleNavbar()
    history.push(`/${sessionUser.username}`)
  }

  goToHelp = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/help')
  }

  goToExplore = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/explore')
  }

  goToHome = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/')
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

  onKeyPress = (e) => {
    const { history } = this.props
    if (this.dropdown.state.open && e.keyCode === 13) {
      if (this.state.hovered) {
        history.push(`/${this.state.hovered}`)
        this.dropdown.toggle()
      }
    }

    // Arrow up
    if (this.dropdown.state.open && e.keyCode === 38) {
      const index = _.findIndex(this.state.searchResults, (username) => {
        return username === this.state.hovered
      })

      return this.setState({ hovered: this.state.searchResults[index - 1]})
    }

    // Arrow down
    if (this.dropdown.state.open && e.keyCode === 40) {
      if (this.state.hovered === '') {
        return this.setState({ hovered: this.state.searchResults[0]})
      } else {
        const index = _.findIndex(this.state.searchResults, (username) => {
          return username === this.state.hovered
        })

        if (index === this.state.searchResults.length - 1) {
          return this.setState({ hovered: this.state.searchResults[index]})
        } else {
          return this.setState({ hovered: this.state.searchResults[index + 1]})
        }
      }
    }
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
    const { sessionUser, defaultImgUrl } = this.context.state
    const isSignedIn = sessionUser.userSession.isUserSignedIn()
    const { user, loading } = this.props

    return (
      <Navbar
        className="debut-nav-bar"
        color="primary"
        fixed="top"
        active={open}
      >

        <Container
          css={css`
            margin-top: 0;
            padding-right: 11px;

            @media only screen and (max-width: 1087px) {
              padding-right: 0;
            }
          `}
        >
          <Navbar.Brand>
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
                    return (
                      <Dropdown.Item
                        onMouseEnter={() => this.setState({ hovered: username })}
                        value={username}
                        style={this.state.hovered === username ? { background: '#E0E3DA' } : {} }
                      >
                        {username}
                      </Dropdown.Item>
                    )
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
                    <Navbar.Item className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop" onClick={this.goToExplore}>
                      Explore
                    </Navbar.Item>
                    <div className={`debut-nav-bar__list-icon navbar-item has-dropdown is-hoverable`}>
                      {
                        _.isEmpty(user) && loading ? <IconLoader /> :
                        <div
                          className="debut-nav-bar__user-identity navbar-link"
                        >
                          <img
                            onError={this.addDefaultSrc}
                            src={_.get(user, 'profileImgUrl', defaultImgUrl)}
                            alt="user"
                            height="45"
                            width="45"
                            />
                        </div>
                      }
                      <div className="debut-nav-bar__list navbar-dropdown is-boxed is-right" style={{ padding: '0' }}>
                        <NavbarList
                          user={user}
                          onHomeClick={this.goToHome}
                          onHelpClick={this.goToHelp}
                          onProfileClick={this.goToProfile}
                          onSignOutClick={this.signOut}
                        />
                      </div>
                    </div>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.goToHome}>
                      Home
                    </Navbar.Item>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.goToProfile}>
                      Profile
                    </Navbar.Item>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.goToHelp}>
                      Help
                    </Navbar.Item>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.signOut}>
                      Sign Out
                    </Navbar.Item>
                  </React.Fragment>
                }
            </Navbar.Container>
          </Navbar.Menu>
        </Container>
      </Navbar>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const user = _.find(state.user.users, (user) => user._id === ownProps.username) || {}
  const loading = state.user.loading

  return {
    user,
    loading,
  };
};


export default withRouter(connect(mapStateToProps)(NavbarComp))
NavbarComp.contextType = UserContext
