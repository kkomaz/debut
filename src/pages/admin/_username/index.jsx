import React, { Component } from 'react'
import { UserContext } from 'components/User/UserProvider'
import {
  Button,
  Card,
  Content,
  Media,
  Image,
  Heading,
  Columns,
} from 'react-bulma-components'
import UserIntroForm from 'components/User/UserIntroForm'
import UserIntroDisplay from 'components/User/IntroDisplay'

class AdminUsernamePage extends Component {
  state = {
    userInfo: {
      description: '',
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
    const { userSession, userData } = this.context.state.sessionUser

    try {
      const response = await userSession.getFile(`user-intro-${userData.identityAddress}.json`, options)
      if (!response) {
        throw new Error('File does not exist')
      }
      this.setState({ userInfo: JSON.parse(response) || '', loading: false, fileExists: true })
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
      userInfo: {
        description,
      },
      displayView: true
    })
  }

  render() {
    const { username, userData, userSession } = this.context.state.sessionUser
    const { loading, userInfo, displayView, fileExists } = this.state

    return (
      <Card className="admin-username-page">
        <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image renderAs="p" size={64} alt="64x64" src={userData.profile.image[0].contentUrl} />
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
                1st Half
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
                        onSubmit={this.onSubmit}
                        identityAddress={userData.identityAddress}
                        userSession={userSession}
                        username={username}
                      />
                    }
                  </div>
                }
              </Columns.Column>
            </Columns>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

AdminUsernamePage.contextType = UserContext
export default AdminUsernamePage
