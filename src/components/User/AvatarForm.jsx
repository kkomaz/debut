import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Image,
} from 'components/bulma'
import { Icon } from 'components/icon'
import './AvatarForm.scss'

class AvatarForm extends Component {
  state = {
    avatarHovered: false
  }

  static propTypes = {
    src: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  setAvatarHoveredTrue = () => {
    this.setState({ avatarHovered: true })
  }

  setAvatarHoveredFalse = () => {
    this.setState({ avatarHovered: false })
  }


  render() {
    const { src } = this.props

    const iconAvatarClassNames = classNames({
      'debut-icon': true,
      'debut-icon--pointer': true,
      'avatar-form__camera-icon': true,
      'avatar-form__camera-icon--hovered': this.state.avatarHovered,
    })

    console.log(this.props.user)

    return (
      <div className="avatar-form">
        <Image
          className="avatar-form__image"
          alt="100x100"
          renderAs="p"
          src={src}
          style={{ margin: 0 }}
          onMouseEnter={this.setAvatarHoveredTrue}
          onMouseLeave={this.setAvatarHoveredFalse}
          onClick={() => console.log('byeee')}
        />
        <Icon
          className={iconAvatarClassNames}
          icon="IconCamera"
          onClick={() => console.log('hiii')}
          size={32}
          onMouseEnter={this.setAvatarHoveredTrue}
        />
      </div>
    )
  }
}

export default AvatarForm
