import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Heading,
} from 'react-bulma-components'
import UserIntroDisplay from 'components/User/IntroDisplay'
import UserIntroForm from 'components/User/UserIntroForm'
import { List } from 'react-content-loader'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon } from 'components/icon'
import './UserDescription.scss'

class UserDescription extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPopoverOpen: false,
      basicInformation: props.user.data.basicInformation,
      descriptionLoading: !props.user.data.basicInformation,
    }
  }

  static propTypes = {
    adminMode: PropTypes.bool.isRequired,
    displayView: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    sessionUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    username: PropTypes.string,
  }

  async componentDidMount() {
    const { basicInformation } = this.state
    const { sessionUser, username } = this.props
    const options = { decrypt: false, username }

    if (!basicInformation) {
      try {
        const userIntro = await sessionUser.userSession.getFile(`user-intro-${username}.json`, options)
        this.setState({
          basicInformation: {
            description: JSON.parse(userIntro).description,
            username,
          },
          descriptionLoading: false,
        })
      } catch (e) {
        this.setState({
          basicInformation: {
            description: '',
            username,
          },
          descriptionLoading: false,
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.data.basicInformation !== this.props.user.data.basicInformation) {
      const { user } = this.props
      return this.setState({
        basicInformation: {
          description: user.data.basicInformation.description,
          username: user.data.basicInformation.username,
        }
      })
    }
  }

  render() {
    const {
      adminMode,
      displayView,
      loading,
      sessionUser,
      username,
    } = this.props

    const {
      descriptionLoading,
    } = this.state

    const { basicInformation } = this.state

    if (descriptionLoading) {
      return <div>Loading...</div>
    }

    if (!adminMode) {
      return (
        <div className="user-description">
          <div className="user-description__about-myself">
            <Heading className="mr-one" size={4}>About Myself</Heading>
              <Popover
                  isOpen={this.state.isPopoverOpen}
                  position="right"
                  padding={30}
                  onClickOutside={() => this.setState({ isPopoverOpen: false })}
                  content={({ position, targetRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={'#383A3F'}
                        arrowSize={10}
                      >
                          <div
                              style={{
                                backgroundColor: '#383A3F',
                                padding: '20px',
                                color: 'white',
                                width: '300px',
                              }}
                              onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                          >
                            <p className="small">
                              Write a small bio about yourself.  Let everyone know who you are!
                            </p>
                          </div>
                      </ArrowContainer>
                  )}
              >
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconQuestionCircle"
                  onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                  size={16}
                />
              </Popover>
          </div>
          {
            loading ? <List /> :
            <UserIntroDisplay
              adminMode={adminMode}
              description={basicInformation.description}
              />
          }
        </div>
      )
    }

    return (
      <div className="user-description__info-details">
        <div className="user-description__about-myself">
          <Heading className="mr-one" size={4}>About Myself</Heading>
            <Popover
                isOpen={this.state.isPopoverOpen}
                position="right"
                padding={30}
                onClickOutside={() => this.setState({ isPopoverOpen: false })}
                content={({ position, targetRect, popoverRect }) => (
                    <ArrowContainer
                      position={position}
                      targetRect={targetRect}
                      popoverRect={popoverRect}
                      arrowColor={'#383A3F'}
                      arrowSize={10}
                    >
                        <div
                            style={{
                              backgroundColor: '#383A3F',
                              padding: '20px',
                              color: 'white',
                              width: '300px',
                            }}
                            onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                        >
                          <p className="small">
                            Write a small bio about yourself.  Let everyone know who you are!
                          </p>
                        </div>
                    </ArrowContainer>
                )}
            >
              <Icon
                className="debut-icon debut-icon--pointer"
                icon="IconQuestionCircle"
                onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                size={16}
              />
            </Popover>
        </div>
        <div className="user-description__button-actions mb-one">
          {
            basicInformation ?
            <Button
              onClick={this.props.onCreateEdit}
              color="primary"
              className="mr-half"
              disabled={!displayView}
            >
              Edit
            </Button> :
            <Button
              onClick={this.props.onCreateEdit}
              color="primary"
              className="mr-half"
              disabled={!displayView}
            >
              Create
            </Button>
          }
        </div>
        {
          displayView ? <UserIntroDisplay description={basicInformation.description} /> :
          <UserIntroForm
            basicInformation={basicInformation}
            description={basicInformation.description}
            onCancel={this.props.onCancel}
            onSubmit={this.props.onSubmit}
            username={username}
          />
        }
      </div>
    )
  }
}

UserDescription.defaultProps = {
  username: ''
}

export default UserDescription
