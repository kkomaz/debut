import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames';
import {
  Field,
  Label,
  Textarea,
  Help,
} from 'react-bulma-components/lib/components/form'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { requestCreateShare } from 'actions/share'
import { Icon } from 'components/icon'
import './ShareCreateForm.scss'

class ShareCreateForm extends Component {
  state = {
    text: '',
    characterLength: 0,
    valid: true,
    imageFile: '',
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }

  onChange = (e) => {
    const { valid } = this.props

    if (!valid) {
      this.setState({ valid: true })
    }

    this.setState({
      [e.target.name]: e.target.value,
      characterLength: e.target.value.length
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()

    const { text, imageFile } = this.state
    const { username } = this.props

    const params = {
      text,
      username,
      imageFile
    }

    if (_.isEmpty(text)) {
      return this.setState({ valid: false })
    }

    this.props.requestCreateShare(params)
    this.setState({
      text: '',
      characterLength: 0,
      imageFile: ''
    })
  }

  onCancel = (e) => {
    e.preventDefault()
    this.setState({ text: '', imageFile: '' })
  }

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmit(e)
    }
  }

  storeFile = (event) => {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
          this.setState({ imageFile: `data:image/jpeg;base64,${Buffer(reader.result).toString("base64")}`});
      };
  };

  render() {
    const { characterLength, valid } = this.state
    const leftoverLength = 150 - characterLength
    const characterClass = classNames({
      'share-create-form__character-length': true,
      'share-create-form__character-length--warning': leftoverLength < 100 && leftoverLength >= 30,
      'share-create-form__character-length--danger': leftoverLength < 30
    })

    return (
      <React.Fragment>
        <form
          className="share-create-form"
          onSubmit={this.onSubmit}
        >
          <Field className="share-create-form__text-field">
            <Textarea
              name="text"
              onChange={this.onChange}
              placeholder="Share a moment here!"
              rows={2}
              value={this.state.text}
              onKeyDown={this.onEnterPress}
              maxLength={150}
              color={valid ? null : 'danger'}
              style={{ borderRadius: 0, borderColor: '#E0E3DA'}}
            />
          </Field>

          {
            !valid && <Help color="danger">Field can not be empty!</Help>
          }

          {
            this.state.imageFile &&
            <div className="share-create-form__image-uploaded">
              <img alt='' src={this.state.imageFile} />
            </div>
          }

          <div className="share-create-form__characters">
            <p className={characterClass}>{150 - this.state.characterLength} characters left</p>
          </div>

          <div className="share-create-form__submit-wrapper">
            <div className="share-create-form__options">
              <Label>
                <Icon
                  className="share-create-form__camera-icon mt-half"
                  icon="IconCamera"
                  size={20}
                />
              <input type="file" onChange={this.storeFile} hidden/>
              </Label>
            </div>

            <div>
              <SubmitFooter
                onCancel={this.onCancel}
                onSubmit={this.onSubmit}
              />
            </div>

          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default connect(null, {
  requestCreateShare,
})(ShareCreateForm)
