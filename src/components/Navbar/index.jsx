/** @jsx jsx */
/* eslint-disable jsx-a11y/anchor-is-valid */

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
import { Icon } from 'components/icon'

// Model Imports
import View from 'model/view'
import Comment from 'model/comment'
import Mention from 'model/mention'
import Share from 'model/share'

// Action Imports
import { setView } from 'actions/view'
import { addAdminComment, removeAdminComment } from 'actions/comment'
import { addAdminMention, removeAdminMention } from 'actions/mention'

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
      currentCommentView: null,
      currentMentionView: null,
    }

    this.fetchList = _.debounce(this.fetchList, 300)
  }

  static propTypes = {
    addAdminComment: PropTypes.func.isRequired,
    addAdminMention: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    removeAdminComment: PropTypes.func.isRequired,
    removeAdminMention: PropTypes.func.isRequired,
    setHomePageClickedTrue: PropTypes.func.isRequired,
    setProfileClickedTrue: PropTypes.func.isRequired,
    setView: PropTypes.func.isRequired,
    view: PropTypes.object,
  }

  componentDidMount = async () => {
    this.setCommentView()
    this.setMentionView()
    this.addShareStreamListener()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.dropdown.state.open) {
      document.addEventListener('keydown', this.onKeyPress, false)
    }

    if (!this.dropdown.state.open) {
      document.removeEventListener('keydown', this.onKeyPress)
    }
  }

  setCommentView = async () => {
    const { sessionUser } = this.context.state
    let view

    const result = await axios.get('/comments', {
      params: {
        parent_creator: sessionUser.username,
        limit: 1,
      }
    })

    const comment = _.get(result, 'data.comments[0]')

    if (comment) {
      const foundView = await View.findOne({ parent_id: comment._id }) || {}
      view = foundView.attrs
    } else {
      view = { initial: true }
    }

    if (_.isEmpty(view)) {
      this.setState({
        currentCommentView: comment,
      })
    }

    this.props.setView(view, 'comment')

    Comment.addStreamListener(this.handleComments)
  }

  setMentionView = async () => {
    const { sessionUser } = this.context.state
    let view

    const result = await axios.get('/mentions', {
      params: {
        username: sessionUser.username,
        limit: 1,
      }
    })

    const mention = _.get(result, 'data.mentions[0]')

    if (mention) {
      const foundMention = await View.findOne({ parent_id: mention._id }) || {}
      view = foundMention.attrs
    } else {
      view = { initial: true }
    }

    if (_.isEmpty(view)) {
      this.setState({
        currentMentionView: mention,
      })
    }

    this.props.setView(view, 'mention')

    Mention.addStreamListener(this.handleMentions)
  }

  addShareStreamListener() {
    Share.addStreamListener(this.handleShare)
  }

  handleShare = (share) => {
    const { sessionUser } = this.context.state

    // Remove Mention View on Share Delete
    if (!share.attrs.valid) {
      // Remove Share Mention
      if (_.includes(share.attrs.mentions, sessionUser.username)) {
        this.props.setView({ initial: true }, 'mention')
        this.props.removeAdminMention(share.attrs._id)
      }
    }
  }

  handleComments = (comment) => {
    const { sessionUser } = this.context.state

    // Remove Comment Mention
    if (_.includes(comment.attrs.mentions, sessionUser.username) && !comment.attrs.valid) {
      this.props.setView({ initial: true }, 'mention')
      this.props.removeAdminMention(comment.attrs._id)
    }

    // Delete Comment
    if (comment.attrs.parent_creator === sessionUser.username && !comment.attrs.valid && comment.attrs.creator !== sessionUser.username) {
      this.props.setView({ initial: true }, 'comment')
      this.props.removeAdminComment(comment.attrs)
    }

    // Add
    if (comment.attrs.parent_creator === sessionUser.username && comment.attrs.valid && comment.attrs.creator !== sessionUser.username) {
      this.props.setView({}, 'comment')
      this.props.addAdminComment(comment.attrs)
      this.setState({ currentCommentView: comment.attrs })
    }
  }

  handleMentions = async (mention) => {
    const { sessionUser } = this.context.state

    // Should refactor this via mongo (add)
    if (mention.attrs.username === sessionUser.username && mention.attrs.creator !== sessionUser.username) {
      this.props.setView({}, 'mention')
      const result = await Mention.findById(mention.attrs._id)
      const updatedMention = { ...result.attrs, parent: result.parent }
      this.props.addAdminMention(updatedMention)
      this.setState({ currentMentionView: updatedMention })
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

  goToEarn = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/earn')
  }

  goToBackOffice = () => {
    const { history } = this.props
    this.toggleNavbar()
    history.push('/back-office')
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
    const { history, viewObj } = this.props
    const { currentCommentView } = this.state

    /**
     * Creating the View will remove the notification
    */
    if (_.isEmpty(viewObj.comment)) {
      const result = new View({
        type: 'comment',
        parent_id: currentCommentView._id
      })
      const newView = await result.save()
      this.props.setView({ ...newView.attrs, _id: newView._id }, 'comment')
    }
    history.push('/admin/recent-comments')
  }

  goToRecentMentions = async () => {
    const { history, viewObj } = this.props
    const { currentMentionView } = this.state

    if (_.isEmpty(viewObj.mention)) {
      const result = new View({
        type: 'mention',
        parent_id: currentMentionView._id
      })
      const newView = await result.save()
      this.props.setView({ ...newView.attrs, _id: newView._id }, 'mention')
    }

    history.push('/admin/mentions')
  }

  render() {
    const { open, searchResults } = this.state
    const { sessionUser, defaultImgUrl } = this.context.state
    const isSignedIn = sessionUser.userSession.isUserSignedIn()
    const { user, loading, viewObj } = this.props

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
                    {
                      user.username === 'kkomaz.id' &&
                      <Navbar.Item className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop" onClick={this.goToBackOffice}>
                        Back Office
                      </Navbar.Item>
                    }
                    <Navbar.Item className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop" onClick={this.goToHome}>
                      Home
                    </Navbar.Item>
                    <Navbar.Item className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop" onClick={this.goToProfile}>
                      Profile
                    </Navbar.Item>
                    <Navbar.Item
                      className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop"
                      onClick={this.goToExplore}
                    >
                      Explore
                    </Navbar.Item>
                    {/*
                      <Navbar.Item className="debut-nav-bar__user-options debut-nav-bar__user-options--desktop" onClick={this.goToEarn}>
                      Earn
                      </Navbar.Item>
                    */}
                    <div className={`debut-nav-bar__list-icon navbar-item has-dropdown is-hoverable`}>
                      {
                        _.isEmpty(user) && loading ?
                        <IconLoader
                          css={css`
                            margin-right: 40px;
                            margin-left: 12px;
                          `}
                        /> :
                        <div className="debut-nav-bar__user-identity navbar-link">
                          <img
                            onError={this.addDefaultSrc}
                            src={_.get(user, 'profileImgUrl', defaultImgUrl)}
                            alt="user"
                            height="45"
                            width="45"
                          />
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
                              display: ${_.some([viewObj.comment, viewObj.mention], (elem) => _.isEmpty(elem)) ? 'flex': 'none'};
                              position: absolute;
                              left: -6px;
                              top: 5px;
                              cursor: pointer;
                            `}
                          >
                            N
                          </div>
                        </div>
                      }
                      <div className="debut-nav-bar__list navbar-dropdown is-boxed is-right" style={{ padding: '0' }}>
                        <NavbarList
                          goToRecent={this.goToRecent}
                          goToRecentMentions={this.goToRecentMentions}
                          onHelpClick={this.goToHelp}
                          onSignOutClick={this.signOut}
                          user={user}
                          viewObj={viewObj}
                        />
                      </div>
                    </div>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.goToProfile}>
                      Profile
                    </Navbar.Item>
                    <Navbar.Item
                      className="debut-nav-bar__user-options"
                      onClick={this.goToRecent}
                    >
                      <div
                        css={theme => css`
                          background: ${theme.colors.blue};
                          border-radius: 15px;
                          color: ${theme.colors.white};
                          justify-content: center;
                          align-items: center;
                          height: 18px;
                          width: 18px;
                          box-sizing: border-box;
                          line-height: 1;
                          min-width: 16px;
                          opacity: 1;
                          padding: 2px 4px 3px;
                          display: ${_.isEmpty(viewObj.comment) ? 'flex' : 'none'};
                          position: absolute;
                          top: 49%;
                          left: 12%;
                          transform: translateY(-50%);
                        `}
                      />
                      <div className="mr-quarter">
                        Recent
                        <Icon
                          className="ml-half mb-quarter"
                          icon="IconBubble"
                          size={14}
                        />
                      </div>
                    </Navbar.Item>
                    <Navbar.Item className="debut-nav-bar__user-options" onClick={this.goToRecentMentions}>
                      <div
                        css={theme => css`
                          background: ${theme.colors.blue};
                          border-radius: 15px;
                          color: ${theme.colors.white};
                          justify-content: center;
                          align-items: center;
                          height: 18px;
                          width: 18px;
                          box-sizing: border-box;
                          line-height: 1;
                          min-width: 16px;
                          opacity: 1;
                          padding: 2px 4px 3px;
                          display: ${_.isEmpty(viewObj.mention) ? 'flex' : 'none'};
                          position: absolute;
                          top: 49%;
                          left: 12%;
                          transform: translateY(-50%);
                        `}
                      />
                      Recent @
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
  const viewObj = state.view

  return {
    user,
    loading,
    viewObj,
  };
};


export default withRouter(connect(mapStateToProps, {
  addAdminComment,
  addAdminMention,
  removeAdminComment,
  removeAdminMention,
  setView,
})(NavbarComp))
NavbarComp.contextType = UserContext
