import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { lookupProfile } from 'blockstack'
import { UserContext } from 'components/User/UserProvider'
import {
  Card,
  Columns,
  Content,
  Media,
  Image,
  Heading,
} from 'components/bulma'
import FollowButton from 'components/Follow/FollowButton'
import moment from 'moment'
import { fetchUserBlockstackApps, returnFilteredUrls } from 'utils/apps'
import {
  IconList,
} from 'components/icon'
import ShareCreateForm from 'components/Share/ShareCreateForm'
import { withRouter } from 'react-router-dom'
import { requestUserShares } from 'actions/share'
import toggleNotification from 'utils/notifier/toggleNotification'
import './UsernamePage.scss';
import {
  UserDescription,
  UserFollowing
} from 'components/User'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (!_.includes(postedDateArray, 'hour') && !_.includes(postedDateArray, 'hours')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}

class UsernamePage extends Component {
  constructor(props, context) {
    super(props)

    const { sessionUser } = context.state

    this.state = {
      userInfo: {
        description: '',
        apps: [],
      },
      loading: true,
      displayView: true,
      fileExists: false,
      message: 'not at bottom',
      style: {
        position: 'absolute',
        top: '0',
        left: '12px',
      },
      activateScroll: false,
      adminMode: props.username === sessionUser.username
    }
  }

  static propTypes = {
    shares: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    blockstackApps: PropTypes.array.isRequired
  }

  async componentDidMount() {
    const { username } = this.props
    const user = await lookupProfile(username)

    if (user) {
      this.loadUserInfo(user)
      this.props.requestUserShares(username)
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { username, searchedProfile, history } = this.props
    const { sessionUser } = this.context.state
    const { loading } = this.state

    if (prevProps.username !== username) {
      const user = await lookupProfile(username)
      if (user) {
        this.setState({ adminMode: sessionUser === username }, () => {
          this.loadUserInfo(user)
        })
      }
    }

    if (prevProps.searchedProfile !== searchedProfile && loading) {
      const apps = _.map((searchedProfile.apps), (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)
      if (!_.includes(filteredDapps, 'https://debutapp_social')) {
        toggleNotification('error', 'User profile is compromised!  Blockstack team is addressing this issue!')
        history.push('/')
      }
    }
  }

  async loadUserInfo(profile) {
    const { username, blockstackApps } = this.props
    const options = { decrypt: false, username }
    const { sessionUser } = this.context.state
    let userIntro
    let userDapps
    let following

    try {
      userIntro = await sessionUser.userSession.getFile(`user-intro-${username}.json`, options)

      const apps = _.map(sessionUser.userData.profile.apps, (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)

      userDapps = await fetchUserBlockstackApps(blockstackApps, filteredDapps)

      following = await sessionUser.userSession.getFile(`users-following-${username}.json`, options)

      if (!userIntro || !userDapps || !following) {
        throw new Error('User intro data does not exist')
      }

      this.setState({
        userInfo: {
          ...JSON.parse(userIntro) || {},
          apps: userDapps,
          following: JSON.parse(following),
          profile,
        },
        loading: false,
        fileExists: true,
      })
    } catch (e) {
      this.setState({
        userInfo: {
          ...JSON.parse(userIntro) || {},
          apps: userDapps || [],
          following: JSON.parse(following) || [],
          profile
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

  followUser = async () => {
    const { username } = this.props
    const { sessionUser, defaultImgUrl } = this.context.state
    const { setSessionUserState } = this.context
    const { userInfo } = this.state

    const options = { encrypt: false }
    const user = {
      username,
      imageUrl: _.get(userInfo, 'profile.image[0].contentUrl', defaultImgUrl)
    }

    const params = [...sessionUser.following, user]

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  unfollowUser = async () => {
    const { username } = this.props
    const { sessionUser } = this.context.state
    const { setSessionUserState } = this.context
    const options = { encrypt: false }

    const params = _.filter(sessionUser.following, (user) => {
      return user.username !== username
    })

    await sessionUser.userSession.putFile(`users-following-${sessionUser.username}.json`, JSON.stringify(params), options)

    setSessionUserState('following', params)
  }

  render() {
    const { sessionUser, defaultImgUrl } = this.context.state
    const { username, history, shares } = this.props
    const { adminMode, loading, userInfo, displayView, fileExists } = this.state

    const src = _.get(userInfo, 'profile.image[0].contentUrl', defaultImgUrl)

    return (
      <React.Fragment>
        <Columns>
          <Columns.Column size={12}>
            <Media className="username__hero">
              <Media.Item renderAs="figure" position="left">
                <Image
                  className="username__avatar"
                  alt="100x100"
                  renderAs="p"
                  src={src}
                  style={{ margin: 0 }}
                  />
              </Media.Item>
              <Media.Item
                position="center"
                style={{ alignSelf: 'center' }}
              >
                <Heading size={4} style={{ color: 'white' }}>{_.get(userInfo, 'profile.name', username)}</Heading>
                <Heading subtitle size={6} style={{ color: 'white' }}>
                  {username}
                </Heading>
                <FollowButton
                  defaultImgUrl={defaultImgUrl}
                  sessionUser={sessionUser}
                  setSessionUserState={this.context.setSessionUserState}
                  userInfo={userInfo}
                  username={username}
                />
              </Media.Item>
            </Media>
          </Columns.Column>
        </Columns>
        <Columns>
          <Columns.Column size={4}>
            <div className="username-page__description mb-one">
              <UserDescription
                adminMode={adminMode}
                displayView={displayView}
                fileExists={fileExists}
                loading={loading}
                sessionUser={sessionUser}
                userInfo={userInfo}
                usename={username}
                onCreateEdit={this.onCreateEdit}
                onCancel={this.onCancel}
                onSubmit={this.onSubmit}
              />
            </div>

            <Card className="admin-username-page mb-one">
              <Card.Content>
                <Content>
                  <Heading size={4}>My Blockstack Dapps</Heading>
                  {
                    _.get(userInfo, 'apps.length', 0) > 0 ?
                    <IconList apps={userInfo.apps} /> :
                      <Heading style={{ color: '#401457' }} size={6}>No installed Blockstack Dapps!</Heading>
                    }

                    <Heading size={6}>
                      Explore and add other Blockstack Dapps <a href="https://app.co/mining" rel="noopener noreferrer" target="_blank">here!</a>
                  </Heading>
                </Content>
              </Card.Content>
            </Card>
            <UserFollowing
              adminMode={adminMode}
              history={history}
              userInfo={userInfo}
            />
          </Columns.Column>

          <Columns.Column
            size={8}
            ref={(rightElement) => this.rightElement = rightElement}
          >
            <Columns>
              <Columns.Column size={12}>
                <Card>
                  <Card.Content>
                    <ShareCreateForm username={username} />
                  </Card.Content>
                </Card>
                {
                  _.map(shares, (share) => {
                    return (
                      <Card key={share._id} className="mt-one admin-username-page__share">
                        <Card.Content>
                          <p><strong>{username}</strong> <span className="admin-username-page__date small">- {formatDate(share.createdAt)}</span></p>
                          <p className="mt-quarter">{share.text}</p>
                        </Card.Content>
                      </Card>
                    )
                  })
                }
              </Columns.Column>
            </Columns>
          </Columns.Column>
        </Columns>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps

  const shares = _.filter(state.share.shares, (share) => share.username === username)
  return {
    blockstackApps: state.blockstack.apps,
    shares,
  }
}

UsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps, {
  requestUserShares
})(UsernamePage))
