/** @jsx jsx */

// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// Components
import { Input, Dropdown, Container } from 'components/bulma'
import { IconLoader } from 'components/Loader'
import { UserContext } from 'components/User/UserProvider'
import NavbarList from './NavbarList'
import Navbar from 'react-bulma-components/lib/components/navbar'

// Model Imports
import View from 'model/view'

// Action Imports
import { setView } from 'actions/view'

// CSS Imports
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
      view: null,
    }

    this.fetchList = _.debounce(this.fetchList, 300)
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    setProfileClickedTrue: PropTypes.func.isRequired,
    setHomePageClickedTrue: PropTypes.func.isRequired,
    setView: PropTypes.func.isRequired,
    view: PropTypes.object,
  }

  componentDidMount = async () => {
    const { sessionUser } = this.context.state
    let view

    const result = await axios.get('/comments', {
      params: {
        parent_creator: sessionUser.username,
        limit: 1,
      }
    })

    const comment = result.data.comments[0]
    if (comment) {
      view = await View.findOne({ parent_id: comment._id }) || null
    } else {
      view = { empty: true }
    }


    this.props.setView(view)

    if (_.isEmpty(view)) {
      this.setState({
        comment
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.dropdown.state.open) {
      document.addEventListener('keydown', this.onKeyPress, false)
    }

    if (!this.dropdown.state.open) {
      document.removeEventListener('keydown', this.onKeyPress)
    }
  }

  componentWillUnmount() {
    console.log('unmounting')
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

  goToRecent = async () => {
    const { history, view } = this.props
    const { comment } = this.state

    if (_.isEmpty(view)) {
      const result = new View({
        type: 'comment',
        parent_id: comment._id
      })
      const newView = await result.save()
      this.props.setView({ ...newView.attrs, _id: newView._id })
    }
    history.push('/admin/recent-comments')
  }

  render() {
    const { open, searchResults } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state
    const isSignedIn = sessionUser.userSession.isUserSignedIn()
    const { user, loading, view } = this.props

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
                    <Navbar.Item onClick={this.goToRecent}>
                      <div
                        css={theme => css`
                          align-self: flex-start;
                          background: ${theme.colors.blue};
                          border-radius: 15px;
                          color: ${theme.colors.white};
                          justify-content: center;
                          align-items: center;
                          height: 23px;
                          width: 23px;
                          box-sizing: border-box;
                          line-height: 1;
                          min-width: 16px;
                          opacity: 1;
                          padding: 2px 4px 3px;
                          display: ${_.isEmpty(view) ? 'flex' : 'none'};
                        `}
                      >
                        N
                      </div>
                      Recent
                    </Navbar.Item>
                    <Navbar.Item
                      className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop"
                      onClick={this.goToExplore}
                    >
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
  const view = state.view.data

  return {
    user,
    loading,
    view,
  };
};


export default withRouter(connect(mapStateToProps, {
  setView,
})(NavbarComp))
NavbarComp.contextType = UserContext
