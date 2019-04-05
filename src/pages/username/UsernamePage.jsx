import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { UserContext } from 'components/User/UserProvider'
import {
  Card,
  Columns,
  Container,
  Content,
  Modal,
  Section,
  Heading,
} from 'components/bulma'
import { fetchUserBlockstackDapps, returnFilteredUrls } from 'utils/apps'
import { withRouter } from 'react-router-dom'
import {
  UserDapps,
  UserDescription,
} from 'components/User'
import {
  NoShares,
  ShareListItem,
  ShareForm,
} from 'components/Share'
import { BarLoader, Loadable } from 'components/Loader'
import toggleNotification from 'utils/notifier/toggleNotification'
import Popover from 'react-tiny-popover'
import SharePopoverContainer from 'components/Popover/SharePopoverContainer'
import { Icon } from 'components/icon'
import { CommentForm } from 'components/comment'

// Action Imports
import { requestUserShares, resetSharesLoading } from 'actions/share'
import { addDappsToList } from 'actions/blockstack'
import './UsernamePage.scss';

class UsernamePage extends Component {
  constructor(props, context) {
    super(props)

    const { sessionUser } = context.state

    this.state = {
      userInfo: {
        dapps: [],
      },
      dappLoading: true,
      bottomReached: false,
      adminMode: props.username === sessionUser.username,
      showModal: false,
      showCommentModal: false,
      currentShare: {},
      currentComment: {},
      longLoad: setTimeout(() => {
        toggleNotification('warning', 'User Profile load is taking longer than usual!  Please be patient or refresh the page!')
      }, 8000),
      isPopoverOpen: false,
      avatarHovered: false,
    }

    this.requestUserShares = _.debounce(this.requestUserShares, 300)
    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    shares: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    commentEditing: PropTypes.bool.isRequired,
    voteActions: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    if (!_.isEmpty(this.props.profile)) {
      this.setState({ dappsLoading: true }, () => {
        this.loadUserInfo(this.props.profile)
      })
    }
    window.addEventListener('scroll', this.handleScroll)
  }

  async componentDidUpdate(prevProps, prevState) {
    const { username } = this.props
    // const { sessionUser } = this.context.state

    if (this.props.username !== prevProps.username) {
      this.props.resetSharesLoading()
    }

    if (!this.props.loading && prevProps.loading) {
      // this.setState({ adminMode: sessionUser.username === username, dappLoading: true })
      this.props.requestUserShares({ username })
      // this.loadUserInfo(profile)
    }

    if (this.props.loading === false) {
      clearTimeout(this.state.longLoad)
    }

    if (!this.props.commentEditing && prevProps.commentEditing) {
      this.closeCommentModal()
    }

    if (!this.props.shareEditing && prevProps.shareEditing) {
      this.closeModal()
    }
  }

  componentWillUnmount() {
    const { sharesLoading } = this.props
    window.removeEventListener('scroll', this.handleScroll)
    clearTimeout(this.state.longLoad)

    if (!sharesLoading) {
      this.props.resetSharesLoading()
    }
  }

  async loadUserInfo(profile) {
    const { dapps } = this.props
    let userDappsRadiks

    try {
      const apps = _.map(profile.apps, (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)
      userDappsRadiks = await fetchUserBlockstackDapps(dapps, filteredDapps)

      if (userDappsRadiks.newDapps.length > 0) {
        this.props.addDappsToList(userDappsRadiks.newDapps)
      }

      if (!userDappsRadiks) {
        throw new Error('User intro data does not exist')
      }

      this.setState({
        userInfo: {
          dapps: _.slice(userDappsRadiks.dapps, 0, 21),
        },
        dappLoading: false,
      })
    } catch (e) {
      return this.setState({
        userInfo: {
          dapps: _.slice(userDappsRadiks.dapps, 0, 21),
        },
        dappLoading: false,
      })
    }
  }

  requestUserShares = () => {
    const { username, shares } = this.props
    const lastShare = _.last(shares.list)
    if (lastShare) {
      this.props.requestUserShares({ username, lt: lastShare.createdAt })
    }
  }

  handleScroll = () => {
    const { bottomReached } = this.state
    const { shares } = this.props

    const html = document.documentElement; // get the html element
    // window.innerHeight - Height (in pixels) of the browser window viewport including, if rendered, the horizontal scrollbar.
    // html.offsetHeight - read-only property returns the height of an element, including vertical padding and borders, as an integer.
    const windowHeight = "innerHeight" in window ? window.innerHeight : html.offsetHeight;
    const body = document.body; // get the document body
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // Find the max value of the overall doc
    const windowBottom = windowHeight + window.pageYOffset; // Viewport + height offset post scroll

    /**
     * if windowBottom is larger then you know you reached the bottom
    */
    if (windowBottom >= docHeight) {
      this.setState({ bottomReached: true }, () => {
        if (!shares.full) {
          this.requestUserShares()
        }
      });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = (share) => {
    this.setState({
      showModal: true,
      currentShare: {
        _id: share._id,
        text: share.text,
        imageFile: share.imageFile,
      }
    })
  }

  closeCommentModal = () => {
    this.setState({ showCommentModal: false })
  }

  openCommentModal = (comment) => {
    this.setState({
      showCommentModal: true,
      currentComment: {
        _id: comment._id,
        text: comment.text,
        imageFile: comment.imageFile,
        share_id: comment.share_id
      }
    })
  }

  togglePopover = () => {
    return this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
  }

  render() {
    const { sessionUser } = this.context.state

    const {
      shares,
      username,
      user,
      sharesLoading,
    } = this.props

    const {
      adminMode,
      bottomReached,
      displayView,
      showModal,
      showCommentModal,
    } = this.state

    return (
      <div className="username-page">
        {
          adminMode &&
          <Card className="mb-one">
            <Card.Content>
              <Content>
                <div className="username-page__share-form-wrapper">
                  <Popover
                    isOpen={this.state.isPopoverOpen}
                    position="right"
                    padding={30}
                    onClickOutside={() => this.setState({ isPopoverOpen: false })}
                    content={({ position, targetRect, popoverRect }) => (
                      <SharePopoverContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        togglePopover={this.togglePopover}
                      />
                    )}
                  >
                    <Icon
                      className="debut-icon debut-icon--pointer username__share-icon-question"
                      icon="IconQuestionCircle"
                      onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                      size={16}
                      linkStyles={{
                        position: 'absolute',
                        top: '0',
                        right: '23px',
                        height: '30px'
                      }}
                    />
                  </Popover>
                  <ShareForm
                    username={username}
                    from="profile"
                  />
                </div>
              </Content>
            </Card.Content>
          </Card>
        }

        {
          !adminMode && _.isEqual(shares.list.length, 0) && !sharesLoading &&
          <NoShares username={username} />
        }

        <CSSTransitionGroup
          transitionName="share-list-item-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {
            _.map(shares.list, (share, index) => {
              const cardClass = _.isEqual(index, 0) ? '' : 'mt-one'

              return (
                <ShareListItem
                  key={share._id}
                  cardClass={cardClass}
                  share={share}
                  username={username}
                  onEditClick={this.openModal}
                  onCommentEditClick={this.openCommentModal}
                  from="profile"
                />
              )
            })
          }
        </CSSTransitionGroup>
        {
          bottomReached && shares.length >= 5 && !shares.full && <BarLoader style={{ height: '200px' }} />
        }

        <Modal
          show={showModal}
          onClose={this.closeModal}
          closeOnEsc
        >
          <Modal.Content>
            <Section style={{ backgroundColor: 'white' }}>
              <Heading size={6}>Shared Moment</Heading>
              <ShareForm
                username={username}
                currentShare={this.state.currentShare}
                onCancel={this.closeModal}
              />
            </Section>
          </Modal.Content>
        </Modal>

        <Modal
          show={showCommentModal}
          onClose={this.closeCommentModal}
          closeOnEsc
        >
          <Modal.Content>
            <Section style={{ backgroundColor: 'white' }}>
              <Heading size={6}>User Comments</Heading>
              <CommentForm
                currentComment={this.state.currentComment}
                onComplete={this.closeCommentModal}
                onCancel={this.closeCommentModal}
                shareId={this.state.currentComment.share_id}
                username={username}
              />
            </Section>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const commentEditing = state.share.commentActions.editing
  const shareEditing = state.share.shareActions.editing
  const sharesLoading = state.share.shares.loading
  const voteActions = state.share.voteActions

  return {
    commentEditing,
    shareEditing,
    sharesLoading,
    voteActions,
  }
}

UsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps, {
  requestUserShares,
  addDappsToList,
  resetSharesLoading,
})(UsernamePage))
