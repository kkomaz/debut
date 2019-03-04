import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import {
  Image,
  Modal,
  Section,
} from 'components/bulma'
import { Icon } from 'components/icon'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
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
    src: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    console.log('unmounting')
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
    this.setState({ showModal: true })
  }

  onCancel = () => {
    const { user, defaultImgUrl } = this.props
    this.setState({ imageFile: _.get(user, 'data.profileImgUrl', defaultImgUrl)})
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

    const iconAvatarClassNames = classNames({
      'debut-icon': true,
      'debut-icon--pointer': true,
      'avatar-form__camera-icon': true,
      'avatar-form__camera-icon--hovered': this.state.avatarHovered,
    })

    return (
      <div className="avatar-form">
        <Image
          className="avatar-form__image"
          alt="100x100"
          renderAs="p"
          src={this.props.user.data.profileImgUrl}
          style={{ margin: 0 }}
          onMouseEnter={this.setAvatarHoveredTrue}
          onMouseLeave={this.setAvatarHoveredFalse}
          onClick={this.openModal}
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
            <Section style={{ backgroundColor: 'white' }}>
              <form className="avatar-form__image-form">
                <div className="avatar-form__image-items">
                  <Image
                    className="avatar-form__image"
                    alt="100x100"
                    renderAs="p"
                    src={this.state.imageFile}
                    style={{ margin: 0 }}
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

export default AvatarForm
