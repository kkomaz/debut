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
} from 'components/bulma'
import {
  requestCreateComment,
} from 'actions/comment'
import { Icon } from 'components/icon'
import toggleNotification from 'utils/notifier/toggleNotification'
import './CommentForm.scss';

class CommentForm extends Component {
  constructor(props) {
    super(props)

    const { currentComment = {} } = props

    this.state = {
      id: currentComment.id || '',
      text: currentComment.text || '',
      characterLength: currentComment.text ? currentComment.text.length : 0,
      valid: true,
      imageFile: currentComment.imageFile || '',
      editMode: !!currentComment.id
    }
  }

  static propTypes = {
    currentComment: PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      imageFile: PropTypes.string,
    }),
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    shareId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
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

    return editMode ? this.editComment() : this.createComment()
  }

  editComment = async () => {
    const { id, text, imageFile } = this.state
    const { username } = this.props

    const params = {
      text,
      username,
      imageFile
    }

    if (_.isEmpty(text)) {
      return this.setState({ valid: false })
    }

    // this.props.requestEditShare(id, params)
    this.props.onComplete()
  }

  createComment = async () => {
    const { text, imageFile } = this.state
    const { username, shareId } = this.props

    const params = {
      share_id: shareId,
      creator: username,
      text,
      imageFile,
    }

    if (_.isEmpty(text)) {
      return this.setState({ valid: false })
    }

    this.props.requestCreateComment(params)
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
    const { characterLength, valid } = this.state
    const leftoverLength = 150 - characterLength
    const characterClass = classNames({
      'comment-form__character-length': true,
      'comment-form__character-length--warning': leftoverLength < 100 && leftoverLength >= 30,
      'comment-form__character-length--danger': leftoverLength < 30
    })

    return (
      <React.Fragment>
        <form
          className="comment-form"
          onSubmit={this.onSubmit}
        >
          <Field className="comment-form__text-field">
            <Textarea
              name="text"
              onChange={this.onChange}
              placeholder="Write a comment..."
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
            <div className="comment-form__image-uploaded">
              <img style={{ maxWidth: '500px', maxHeight: '500px' }} alt='' src={this.state.imageFile} />
              <Icon
                className="comment-form__image-remove-button debut-icon debut-icon--pointer"
                icon="IconX"
                color="#E71D36"
                size={20}
                onClick={this.onCancelImage}
              />
            </div>
          }

          <div className="comment-form__characters">
            <p className={characterClass}>{150 - this.state.characterLength} characters left</p>
          </div>

          <div className="comment-form__submit-wrapper">
            <div className="comment-form__options">
              <Label>
                <Icon
                  className="debut-icon debut-icon--pointer mt-half"
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
        </form>
      </React.Fragment>
    )
  }
}

CommentForm.defaultProps = {
  onCancel: _.noop,
  onComplete: _.noop,
}

export default connect(null, {
  requestCreateComment,
})(CommentForm)
