import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { UserContext } from 'components/User/UserProvider'
import Button from 'react-bulma-components/lib/components/button'
import Card from 'react-bulma-components/lib/components/card'
import Columns from 'react-bulma-components/lib/components/columns'
import Content from 'react-bulma-components/lib/components/content'
import Media from 'react-bulma-components/lib/components/media'
import Image from 'react-bulma-components/lib/components/image'
import Heading from 'react-bulma-components/lib/components/heading'
import UserIntroForm from 'components/User/UserIntroForm'
import UserIntroDisplay from 'components/User/IntroDisplay'
import { fetchUserBlockstackApps, returnFilteredUrls } from 'utils/apps'
import IconList from 'components/icon/List'
import UserList from 'components/icon/UserList'
import { withRouter } from 'react-router-dom'

class AdminUsernamePage extends Component {
  state = {
    userInfo: {
      description: '',
      apps: [],
    },
    loading: true,
    displayView: true,
    fileExists: false,
  }

  componentDidMount() {
    this.loadUserInfo()
  }

  async loadUserInfo() {
    const options = { decrypt: false }
    const { userSession, userData, username } = this.context.state.sessionUser
    const { blockstackApps } = this.props

    try {
      let result

      result = await userSession.getFile(`user-intro-${username}.json`, options)

      if (!result) {
        result = await userSession.getFile(`user-intro-${userData.identityAddress}.json`, options)
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
    const { loading, userInfo, displayView, fileExists } = this.state
    const { history } = this.props

    console.log(userInfo)

    const src = _.get(userData, 'profile.image[0].contentUrl', 'https://i.imgur.com/w1ur3Lq.jpg')
    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image onError={this.addDefaultSrc} renderAs="p" size={64} alt="64x64" src={src} />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{userData.profile.name}</Heading>
              <Heading subtitle size={6}>
                {username}
              </Heading>
            </Media.Item>
          </Media>
          <Content>
            <Columns className="mt-one">
              <Columns.Column size={6}>
                <h4>My Apps</h4>
                <IconList apps={userInfo.apps} />
              </Columns.Column>
              <Columns.Column size={6}>
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
                      <Button onClick={this.onShowDisplay} color="warning">
                        Show Display
                      </Button>
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
              </Columns.Column>
              <Columns.Column size={6}>
                <h4>Following</h4>

                <UserList users={userInfo.following} history={history} />
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
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
