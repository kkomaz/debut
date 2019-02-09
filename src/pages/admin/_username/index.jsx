import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { UserContext } from 'components/User/UserProvider'
import {
  Button,
  Card,
  Columns,
  Content,
  Media,
  Image,
  Heading,
} from 'components/bulma'
import UserIntroForm from 'components/User/UserIntroForm'
import UserIntroDisplay from 'components/User/IntroDisplay'
import { fetchUserBlockstackApps, returnFilteredUrls } from 'utils/apps'
import {
  IconList,
  UserList
} from 'components/icon'
import { withRouter, Link } from 'react-router-dom'

class AdminUsernamePage extends Component {
  state = {
    userInfo: {
      description: '',
      apps: [],
    },
    loading: true,
    displayView: true,
    fileExists: false,
    height: window.innerHeight,
    message: 'not at bottom',
    style: {
      position: 'absolute',
      top: '0',
      left: '12px',
    }
  }

  componentDidMount() {
    this.loadUserInfo()
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;

      if (windowBottom >= docHeight) {
          this.setState({
            message: 'bottom reached',
            style: {
              position: 'absolute',
              bottom: '15px'
            }
          });
      } else if (window.pageYOffset < 20) {
        this.setState({
          style: {
            position: 'absolute',
            top: '0'
          }
        })
      } else {
          this.setState({
            message: 'not at bottom',
          });
      }
  }


  async loadUserInfo() {
    const options = { decrypt: false }
    const { userSession, userData, username } = this.context.state.sessionUser
    const { blockstackApps } = this.props

    try {
      let result

      result = await userSession.getFile(`user-intro-${username}.json`, options)

      if (!result) {
        throw new Error('User intro data does not exist')
      }

      const apps = _.map(userData.profile.apps, (k,v) => {
        return v
      })

      const filteredDapps = returnFilteredUrls(apps)

      const userDapps = await fetchUserBlockstackApps(blockstackApps, filteredDapps)

      const following = await userSession.getFile(`users-following-${username}.json`, options)

      this.setState({
        userInfo: {
          ...JSON.parse(result) || {},
          apps: userDapps,
          following: JSON.parse(following)
        },
        loading: false,
        fileExists: true,
      })
    } catch (e) {
      this.setState({ loading: false })
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

  render() {
    const { username, userData, userSession } = this.context.state.sessionUser
    const { defaultImgUrl } = this.context.state
    const { loading, userInfo, displayView, fileExists } = this.state
    const { history } = this.props

    const src = _.get(userData, 'profile.image[0].contentUrl', defaultImgUrl)

    console.log(this.state.message)

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
                  size={100}
                  src={src}
                  style={{ margin: 0 }}
                  />
              </Media.Item>
              <Media.Item
                position="center"
                style={{ alignSelf: 'center' }}
              >
                <Heading size={4} style={{ color: 'white' }}>{userData.profile.name}</Heading>
                <Heading subtitle size={6} style={{ color: 'white' }}>
                  {username}
                </Heading>
              </Media.Item>
            </Media>
          </Columns.Column>
        </Columns>
        <Columns>
          <div style={{ position: 'relative', width: '33%' }}>
            <div style={this.state.style}>
              <Card className="admin-username-page">
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
              <Card className="admin-username-page mt-one">
                <Card.Content>
                  <Content>
                    <Heading size={4}>Following Users</Heading>
                    {
                      _.get(userInfo, 'following.length', 0) ?
                      <UserList users={userInfo.following} history={history} /> :
                        <Heading size={6}>Add users <Link to="/">here!</Link></Heading>
                      }
                    </Content>
                  </Card.Content>
                </Card>
            </div>
          </div>

          <Columns.Column size={8}>
            <Columns>
              <Columns.Column size={12} style={{ paddingTop: '0' }}>
                <Card className="username-page">
                  <Card.Content>
                    <Content>
                      <h4>About Myself</h4>
                      {
                        loading ? <div>Loading...</div> :
                        <div className="admin-username-page__info-details">
                          <div className="admin-username-page__button-actions mb-one">
                            {
                              fileExists ?
                              <Button onClick={this.onCreateEdit} color="primary" className="mr-half">
                                Edit
                              </Button> :
                              <Button onClick={this.onCreateEdit} color="primary" className="mr-half">
                                Create
                              </Button>
                            }
                          </div>
                          {
                            displayView ? <UserIntroDisplay description={userInfo.description} /> :
                            <UserIntroForm
                              description={userInfo.description}
                              fileExists={fileExists}
                              onCancel={this.onCancel}
                              onSubmit={this.onSubmit}
                              identityAddress={userData.identityAddress}
                              userSession={userSession}
                              username={username}
                              />
                          }
                        </div>
                      }
                    </Content>
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
                <Card className="mt-one">
                  <Card.Content>
                    Tweet 1
                  </Card.Content>
                </Card>
              </Columns.Column>
            </Columns>
          </Columns.Column>
        </Columns>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blockstackApps: state.blockstack.apps
  }
}

AdminUsernamePage.contextType = UserContext
export default withRouter(connect(mapStateToProps)(AdminUsernamePage))
