import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  Content
} from 'react-bulma-components'
import UserIntroDisplay from 'components/User/IntroDisplay'
import UserIntroForm from 'components/User/UserIntroForm'
import { List } from 'react-content-loader'
import { Loadable } from 'components/Loader'

class UserDescription extends Component {
  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    displayView: PropTypes.bool.isRequired,
    fileExists: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    sessionUser: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    username: PropTypes.string
  }

  render() {
    const {
      adminMode,
      displayView,
      fileExists,
      loading,
      sessionUser,
      userInfo,
      username,
    } = this.props

    if (!adminMode) {
      return (
        <Card className="user-description">
          <Card.Content>
            <Content>
              <h4>About Myself</h4>
              {
                loading ? <List /> :
                <UserIntroDisplay
                  adminMode={adminMode}
                  description={userInfo.description}
                  />
              }
            </Content>
          </Card.Content>
        </Card>
      )
    }

    console.log(fileExists)

    return (
      <Card className="user-description">
        <Card.Content>
          <Content>
            <h4>About Myself</h4>
            <Loadable loading={loading}>
              <div className="user-description__info-details">
                <div className="user-description__button-actions mb-one">
                  {
                    fileExists ?
                    <Button onClick={this.props.onCreateEdit} color="primary" className="mr-half">
                      Edit
                    </Button> :
                    <Button onClick={this.props.onCreateEdit} color="primary" className="mr-half">
                      Create
                    </Button>
                  }
                </div>
                {
                  displayView ? <UserIntroDisplay description={userInfo.description} /> :
                  <UserIntroForm
                    description={userInfo.description}
                    fileExists={fileExists}
                    onCancel={this.props.onCancel}
                    onSubmit={this.props.onSubmit}
                    identityAddress={sessionUser.userData.identityAddress}
                    userSession={sessionUser.userSession}
                    username={username}
                    />
                }
              </div>
            </Loadable>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

UserDescription.defaultProps = {
  username: ''
}

export default UserDescription
