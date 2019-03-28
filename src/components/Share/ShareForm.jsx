import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames';
import {
  BulmaLoader,
  Field,
  Label,
  Textarea,
  Help,
} from 'components/bulma'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import {
  requestCreateShare,
  requestEditShare
} from 'actions/share'
import { Icon } from 'components/icon'
import toggleNotification from 'utils/notifier/toggleNotification'
import './ShareForm.scss'

class ShareForm extends Component {
  constructor(props) {
    super(props)

    const { currentShare = {} } = props

    this.state = {
      _id: currentShare._id || '',
      text: currentShare.text || '',
      characterLength: currentShare.text ? currentShare.text.length : 0,
      valid: true,
      imageFile: currentShare.imageFile || '',
      editMode: !_.isEmpty(currentShare._id)
    }
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    currentShare: PropTypes.shape({
      _id: PropTypes.string,
      text: PropTypes.string,
      imageFile: PropTypes.string,
    })
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

  onSubmit = (e) => {
    e.preventDefault()

    const { editMode } = this.state

    return editMode ? this.editShare() : this.createShare()
  }

  editShare = async () => {
    const { _id, text, imageFile } = this.state
    const { username } = this.props

    const params = {
      text,
      username,
      imageFile
    }

    if (_.isEmpty(text)) {
      return this.setState({ valid: false })
    }

    this.props.requestEditShare(_id, params)
    this.props.onComplete()
  }

  createShare = async () => {
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
    this.fileInput.value = ''
    this.setState({
      id: '',
      text: '',
      characterLength: 0,
      valid: true,
      imageFile: ''
    }, this.props.onCancel)
  }

  onCancelImage = (e) => {
    e.preventDefault()
    const { editMode } = this.state
    this.fileInput.value = ''
    this.setState({
      imageFile: ''
    })

    return editMode && this.props.onCancel
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
    const { valid, editMode } = this.state
    const { editing, submitting } = this.props
    const characterClass = classNames({
      'share-form__character-length': true,
      'small': true
    })

    return (
      <React.Fragment>
        <form
          className="share-form"
          onSubmit={this.onSubmit}
        >
          <Field className="share-form__text-field">
            <Textarea
              name="text"
              onChange={this.onChange}
              placeholder="Share a moment here!"
              rows={2}
              value={this.state.text}
              onKeyDown={this.onEnterPress}
              maxLength={150}
              color={valid ? null : 'danger'}
              style={{
                fontFamily: 'Poppins, sans-serif',
                borderRadius: 0,
                borderColor: '#E0E3DA',
                fontSize: '14px'
              }}
            />
          </Field>

          {
            !valid && <Help color="danger">Field can not be empty!</Help>
          }

          {
            this.state.imageFile &&
            <div className="share-form__image-uploaded">
              <img style={{ maxWidth: '500px', maxHeight: '500px' }} alt='' src={this.state.imageFile} />
              <Icon
                className="share-form__image-remove-button debut-icon debut-icon--pointer"
                icon="IconX"
                color="#E71D36"
                size={20}
                onClick={this.onCancelImage}
              />
            </div>
          }

          <div className="share-form__characters">
            <p className={characterClass}>({150 - this.state.characterLength})</p>
            <div className="share-form__options">
              <Label>
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconCamera"
                  size={20}
                />
                <input
                  type="file"
                  onChange={this.storeFile}
                  hidden
                  accept="image/*"
                  ref={fileInput => this.fileInput = fileInput}
                />
              </Label>
            </div>
          </div>

          <div className="share-form__submit-wrapper">
            {
              !editMode &&
              <div className="share-form__submit-footer">
                { submitting && <BulmaLoader className="mr-one" />}
                <SubmitFooter
                  onCancel={this.onCancel}
                  onSubmit={this.onSubmit}
                  submitting={submitting}
                />
              </div>
            }

            {
              editMode &&
              <div className="share-form__submit-footer">
                { editing && <BulmaLoader className="mr-one" />}
                <SubmitFooter
                  onCancel={this.onCancel}
                  onSubmit={this.onSubmit}
                  submitting={editing}
                />
              </div>
            }
          </div>
        </form>
      </React.Fragment>
    )
  }
}

ShareForm.defaultProps = {
  onCancel: _.noop,
  onComplete: _.noop,
}

const mapStateToProps = (state) => {
  const submitting = state.share.shareActions.submitting
  const editing = state.share.shareActions.editing

  return {
    submitting,
    editing,
  }
}

export default connect(mapStateToProps, {
  requestCreateShare,
  requestEditShare,
})(ShareForm)
