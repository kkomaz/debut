// Library imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { connect } from 'react-redux'

// Component Imports
import {
  Image,
  Modal,
  Section,
  Heading,
} from 'components/bulma'
import { Icon } from 'components/icon'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { HeroAvatarLoader } from 'components/Loader'

// Action & util imports
import { requestSetUserAvatar } from 'actions/user'
import toggleNotification from 'utils/notifier/toggleNotification'
import './AvatarForm.scss'

class AvatarForm extends Component {
  constructor(props) {
    super(props)

    const { user, defaultImgUrl } = props

    this.state = {
      avatarHovered: false,
      showModal: false,
      imageFile: _.get(user, 'data.profileImgUrl', defaultImgUrl)
    }
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    sessionUser: PropTypes.object.isRequired,
  }

  setAvatarHoveredTrue = () => {
    this.setState({ avatarHovered: true })
  }

  setAvatarHoveredFalse = () => {
    this.setState({ avatarHovered: false })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = () => {
    const { sessionUser, user } = this.props
    if (sessionUser.username === user.data.username) {
      this.setState({ showModal: true })
    }
  }

  onCancel = () => {
    const { user, defaultImgUrl } = this.props
    this.setState({ imageFile: _.get(user, 'data.profileImgUrl', defaultImgUrl)})
    this.closeModal()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { imageFile } = this.state
    const { user } = this.props

    this.props.requestSetUserAvatar(
      imageFile,
      user.data.username,
    )
    this.closeModal()
  }

  storeFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file.size >= 5000000) {
      return toggleNotification('error', 'File size must be lower than 5mb!')
    }

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    return reader.onloadend = () => {
      return this.setState({ imageFile: `data:image/jpeg;base64,${Buffer(reader.result).toString("base64")}`});
    };
  };

  render() {
    const { showModal } = this.state
    const {
      user,
      defaultImgUrl,
      sessionUser,
    } = this.props

    if (!user.data) {
      return <HeroAvatarLoader />
    }

    const iconAvatarClassNames = classNames({
      'debut-icon': true,
      'debut-icon--pointer': true,
      'avatar-form__camera-icon': true,
      'avatar-form__camera-icon--hovered': this.state.avatarHovered && sessionUser.username === user.data.username
    })

    const avatarFormImageClass = classNames({
      'avatar-form__image': true,
      'avatar-form__image--clickable': sessionUser.username === user.data.username,
      'avatar-form__image--hovered': this.state.avatarHovered && sessionUser.username === user.data.username
    })

    return (
      <div className="avatar-form">
        <Image
          className={avatarFormImageClass}
          renderAs="p"
          onMouseEnter={this.setAvatarHoveredTrue}
          onMouseLeave={this.setAvatarHoveredFalse}
          onClick={this.openModal}
          style={{
            backgroundImage: `url(${this.props.user.data.profileImgUrl || defaultImgUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            margin: 0,
            borderRadius: '100%'
          }}
        />

        <Icon
          className={iconAvatarClassNames}
          icon="IconCamera"
          onClick={this.openModal}
          size={32}
          onMouseEnter={this.setAvatarHoveredTrue}
        />

        <Modal
          show={showModal}
          onClose={this.closeModal}
          closeOnEsc
        >
          <Modal.Content>
            <Heading size={4}>Avatar Form</Heading>
            <Section className="avatar-form__section">
              <Heading
                className="avatar-form__section-title"
                size={4}
              >
                {user.data.username} avatar form
              </Heading>
              <form
                className="avatar-form__image-form"
                onSubmit={this.onSubmit}
              >
                <div className="avatar-form__image-items">
                  <Image
                    className="avatar-form__image"
                    renderAs="p"
                    style={{
                      backgroundImage: `url(${this.state.imageFile})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '50% 50%',
                      margin: 0,
                      borderRadius: '100%'
                    }}
                    />

                  <input
                    className="avatar-form__input"
                    type="file"
                    onChange={this.storeFile}
                    accept="image/*"
                    ref={fileInput => this.fileInput = fileInput}
                  />
                </div>

                <SubmitFooter
                  className="avatar-form__submit-footer"
                  onCancel={this.onCancel}
                  onSubmit={this.onSubmit}
                />
              </form>
            </Section>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default connect(null, {
  requestSetUserAvatar
})(AvatarForm)
