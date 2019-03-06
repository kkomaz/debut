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
  Media,
  Heading,
  Modal,
  Section,
} from 'components/bulma'
import FollowButton from 'components/Follow/FollowButton'
import { fetchUserBlockstackDapps, returnFilteredUrls } from 'utils/apps'
import { withRouter } from 'react-router-dom'
import {
  UserDapps,
  UserDescription,
  UserFollowing
} from 'components/User'
import {
  UserTabs
} from 'components/Tab'
import {
  NoShares,
  ShareListItem,
  ShareForm,
} from 'components/Share'
import { BarLoader, HeroAvatarLoader, Loadable } from 'components/Loader'
import toggleNotification from 'utils/notifier/toggleNotification'
import { List } from 'react-content-loader'
import Popover from 'react-tiny-popover'
import SharePopoverContainer from 'components/Popover/SharePopoverContainer'
import { Icon } from 'components/icon'
import { AvatarForm } from 'components/User'
import FollowingUser from 'components/Follow/FollowingUsers'
import FollowersUsers from 'components/Follow/FollowersUsers'

// Action Imports
import { requestUserShares } from 'actions/share'
import { addDappsToList } from 'actions/blockstack'
import { requestSingleUser } from 'actions/user'
import { requestFetchFollow} from 'actions/follow'
import './UsernamePage.scss';

class UsernamePage extends Component {
  constructor(props, context) {
    super(props)

    const { sessionUser } = context.state

    this.state = {
      userInfo: {
        dapps: [],
      },
      loading: true,
      displayView: true,
      bottomReached: false,
      adminMode: props.username === sessionUser.username,
      showModal: false,
      currentShare: {},
      longLoad: setTimeout(() => {
        toggleNotification('warning', 'User Profile load is taking longer than usual!  Please be patient or refresh the page!')
      }, 8000),
      error: false,
      isPopoverOpen: false,
      avatarHovered: false,
      activeTab: 'profile'
    }

    this.requestUserShares = _.debounce(this.requestUserShares, 300)
    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    shares: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  async componentDidMount() {
    const { username } = this.props
    // (no data or slim data then make request for full data)
    // if (!user.data || (user.data && !user.data.basicInformation)) {
    //   this.props.requestSingleUser(username)
    // }
    this.props.requestSingleUser(username)
    window.addEventListener('scroll', this.handleScroll)
  }

  async componentDidUpdate(prevProps, prevState) {
    const { username, user } = this.props
    const { sessionUser } = this.context.state

    // Changing User Profiles
    if (username !== prevProps.username) {
      this.props.requestSingleUser(username)
      this.setState({ adminMode: sessionUser.username === username })
    }

    // Loading of single user complete
    if (!user.loading && prevProps.user.loading) {
      // If radiks user does not exist send to unsigned page

      this.loadUserInfo(this.props.profile)
      this.props.requestFetchFollow(username)
      this.requestUserShares()
    }

    if (this.state.loading === false) {
      clearTimeout(this.state.longLoad)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    clearTimeout(this.state.longLoad)
  }

  async loadUserInfo(profile) {
    const { username, dapps } = this.props
    const options = { decrypt: false, username }
    const { sessionUser } = this.context.state
    let userDappsRadiks
    let following

    try {
      const apps = _.map(profile.apps, (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)
      following = await sessionUser.userSession.getFile(`users-following-${username}.json`, options) || '[]'
      userDappsRadiks = await fetchUserBlockstackDapps(dapps, filteredDapps)

      if (userDappsRadiks.newDapps.length > 0) {
        this.props.addDappsToList(userDappsRadiks.newDapps)
      }

      if (!userDappsRadiks || !following) {
        throw new Error('User intro data does not exist')
      }

      this.setState({
        userInfo: {
          dapps: _.slice(userDappsRadiks.dapps, 0, 21),
          following: JSON.parse(following),
        },
        loading: false,
      })
    } catch (e) {
      return this.setState({
        userInfo: {
          following: JSON.parse(following),
          dapps: _.slice(userDappsRadiks.dapps, 0, 21),
        },
        loading: false,
      })
    }
  }

  onCreateEdit = () => {
    this.setState({ displayView: false })
  }

  onShowDisplay = () => {
    this.setState({ displayView: true })
  }

  onSubmit = (data) => {
    const { description } = data

    this.setState({
      userInfo: { ...this.state.userInfo, description },
      displayView: true
    })
  }

  onCancel = () => {
    this.setState({ displayView: true })
  }

  addDefaultSrc = (evt) => {
    evt.target.src = 'https://i.imgur.com/w1ur3Lq.jpg'
  }

  requestUserShares = () => {
    const { username, shares } = this.props
    const sharesLength = shares.list.length
    this.props.requestUserShares({ username, offset: sharesLength })
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
        id: share._id,
        text: share.text,
        imageFile: share.imageFile,
      }
    })
  }

  togglePopover = () => {
    return this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
  }

  setActiveTab = (value) => {
    this.setState({ activeTab: value })
  }

  render() {
    const {
      sessionUser,
      defaultImgUrl
    } = this.context.state

    const {
      history,
      shares,
      username,
      user,
      follow,
    } = this.props

    const {
      adminMode,
      activeTab,
      bottomReached,
      loading,
      userInfo,
      displayView,
      showModal,
    } = this.state

    const src = _.get(user, 'data.profile.image[0].contentUrl', defaultImgUrl)

    if (this.state.error) {
      return (
        <div>
          <List />
        </div>
      )
    }

    return (
      <Container>
        <Columns>
          <Columns.Column size={12} style={{ paddingBottom: '0' }}>
            <Media className="username__hero">
              <Media.Item renderAs="figure" position="left">
                {
                  (user.loading || loading || user.avatarLoading) ?
                  <HeroAvatarLoader /> :
                  <AvatarForm
                    src={src}
                    user={user}
                    defaultImgUrl={defaultImgUrl}
                    sessionUser={sessionUser}
                  />
                }
              </Media.Item>
              <Media.Item
                position="center"
                style={{ alignSelf: 'center' }}
              >
                <Heading size={4} style={{ color: 'white' }}>{_.get(user, 'data.profile.name', username)}</Heading>
                <Heading subtitle size={6} style={{ color: 'white' }}>
                  {username}
                </Heading>
                <FollowButton
                  defaultImgUrl={defaultImgUrl}
                  sessionUser={sessionUser}
                  user={user}
                  username={username}
                />
              </Media.Item>
            </Media>
          </Columns.Column>
          <Columns.Column size={12} style={{ paddingTop: '0' }}>
            <UserTabs
              username={username}
              setActiveTab={this.setActiveTab}
              activeTab={activeTab}
            />
          </Columns.Column>
        </Columns>

        {
          activeTab === 'profile' && <Columns className="mt-half">
            <Columns.Column size={5}>
              <div className="username__description mb-one">
                <Card className="user-description">
                  <Card.Content>
                    <Content>
                      <Loadable loading={user.loading || !user.data}>
                        <UserDescription
                          adminMode={adminMode}
                          displayView={displayView}
                          loading={loading}
                          sessionUser={sessionUser}
                          user={user}
                          username={username}
                          onCreateEdit={this.onCreateEdit}
                          onCancel={this.onCancel}
                          onSubmit={this.onSubmit}
                          />
                      </Loadable>
                    </Content>
                  </Card.Content>
                </Card>
              </div>

              <div className="username__dapps mb-one">
                <UserDapps
                  adminMode={adminMode}
                  loading={loading}
                  userInfo={userInfo}
                />
              </div>

              <div className="username__following mb-one">
                <UserFollowing
                  adminMode={adminMode}
                  history={history}
                  loading={loading}
                  userInfo={userInfo}
                />
              </div>
            </Columns.Column>

            <Columns.Column
              size={7}
              ref={(rightElement) => this.rightElement = rightElement}
            >
              <Columns>
                <Columns.Column size={12}>
                  {
                    adminMode &&
                    <Card className="mb-one">
                      <Card.Content>
                        <Content>
                          <Loadable loading={shares.loading && shares.list.length === 0}>
                            <div>
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
                                    right: '5px',
                                    height: '30px'
                                  }}
                                />
                              </Popover>
                              <ShareForm username={username} />
                            </div>
                          </Loadable>
                        </Content>
                      </Card.Content>
                    </Card>
                  }

                  {
                    !adminMode && _.isEqual(shares.list.length, 0) &&
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
                          />
                        )
                      })
                    }
                  </CSSTransitionGroup>
                  {
                    bottomReached && !shares.full && <BarLoader style={{ height: '200px' }} />
                  }
                </Columns.Column>
              </Columns>
              <Modal
                show={showModal}
                onClose={this.closeModal}
                closeOnEsc
              >
                <Modal.Content>
                  <Section style={{ backgroundColor: 'white' }}>
                    <ShareForm
                      username={username}
                      currentShare={this.state.currentShare}
                      onCancel={this.closeModal}
                      onComplete={this.closeModal}
                    />
                  </Section>
                </Modal.Content>
              </Modal>
            </Columns.Column>
          </Columns>
        }
        {
          follow && activeTab === 'following' &&
          <FollowingUser
            className={activeTab === 'following' ? 'following-user' : 'following-user hidden'}
            follow={follow}
            setActiveTab={this.setActiveTab}
          />
        }
        {
          follow && activeTab === 'followers' &&
          <FollowersUsers
            className={activeTab === 'followers' ? 'followers-user' : 'followers-user hidden'}
            follow={follow}
            setActiveTab={this.setActiveTab}
          />
        }
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps
  const follow = state.follow[username]

  return {
    follow,
  }
}

UsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps, {
  requestUserShares,
  addDappsToList,
  requestSingleUser,
  requestFetchFollow,
})(UsernamePage))
