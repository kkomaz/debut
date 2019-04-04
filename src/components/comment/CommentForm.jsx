/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  BulmaLoader,
  Field,
  Label,
  Textarea,
  Help,
} from 'components/bulma'
import {
  requestCreateComment,
  requestEditComment,
} from 'actions/comment'
import { Icon } from 'components/icon'
import toggleNotification from 'utils/notifier/toggleNotification'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { Picker } from 'emoji-mart'
import emojiStyles from 'utils/styles/emojiStyles'

class CommentForm extends Component {
  constructor(props) {
    super(props)

    const { currentComment = {} } = props

    this.state = {
      _id: currentComment._id || '',
      text: currentComment.text || '',
      characterLength: currentComment.text ? currentComment.text.length : 0,
      valid: true,
      imageFile: currentComment.imageFile || '',
      editMode: !_.isEmpty(currentComment._id),
      showEmojis: false,
      textAreaRow: 1,
    }
  }

  static propTypes = {
    currentComment: PropTypes.shape({
      _id: PropTypes.string,
      text: PropTypes.string,
      imageFile: PropTypes.string,
    }),
    commentActions: PropTypes.shape({
      submitting: PropTypes.bool.isRequired,
      editing: PropTypes.bool.isRequired,
      shareId: PropTypes.string.isRequired,
    }).isRequired,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
    shareId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    requestEditComment: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps, prevState) {
    const currentTextLines = (this.state.text.match(/\n/g)||[]).length
    const prevTextLines = (prevState.text.match(/\n/g)||[]).length

    if (currentTextLines === 0 && prevTextLines > 0) {
      this.setState({ textAreaRow: 1 })
    }

    if (currentTextLines < prevTextLines && currentTextLines >= 1) {
      const difference = prevTextLines - currentTextLines
      this.setState({ textAreaRow: this.state.textAreaRow - difference })
    }
  }

  // Emoji functions - start
  showEmojis = (e) => {
    this.setState({
      showEmojis: true
    }, () => document.addEventListener('click', this.closeMenu))
  }

  closeMenu = (e) => {
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
      this.setState({
        showEmojis: false
      }, () => document.removeEventListener('click', this.closeMenu))
    }
  }

  addEmoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emojiPic = String.fromCodePoint(...codesArray)
    this.setState({
       text: this.state.text + emojiPic
    })
  }
  // Emoji functions - end

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

    this.props.requestEditComment(_id, params)
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

    this.props.requestCreateComment(params, shareId)
    this.setState({
      text: '',
      characterLength: 0,
      imageFile: ''
    })
    this.props.onComplete()
  }

  onCancel = (e) => {
    e.preventDefault()
    this.fileInput.value = ''
    this.setState({
      _id: '',
      text: '',
      characterLength: 0,
      valid: true,
      imageFile: '',
      textAreaRow: 1
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
    if (e.keyCode === 13 && e.shiftKey) {
      if ((this.state.text.match(/\n/g)||[]).length >= 0) {
        this.setState({ textAreaRow: this.state.textAreaRow + 1 })
      }
    }

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
    const { commentActions, shareId } = this.props

    return (
      <div
        css={css`
          position: relative;

          .emoji-wrapper :focus:not(.focus-visible) {
            outline: none;
          }
        `}
      >
        <form
          className="comment-form"
          onSubmit={this.onSubmit}
        >
          <Field
            css={css`
              margin-bottom: 0 !important;
            `}
          >
            <Textarea
              name="text"
              onChange={this.onChange}
              placeholder="Write a comment..."
              rows={this.state.textAreaRow}
              value={this.state.text}
              onKeyDown={this.onEnterPress}
              maxLength={150}
              color={valid ? null : 'danger'}
              css={css`
                border-radius: 3px;
                border-color: #E0E3DA;
                font-size: 12px;
              `}
              style={{
                fontFamily: 'Poppins, sans-serif'
              }}
            />
          </Field>

          {
            !valid && <Help color="danger">Field can not be empty!</Help>
          }

          {
            this.state.imageFile &&
            <div
              css={theme => css`
                align-items: center;
                border-bottom: 1px solid ${theme.colors.shadow};
                border-left: 1px solid ${theme.colors.shadow};
                border-right: 1px solid ${theme.colors.shadow};
                display: flex;
                padding: 10px 0 10px 20px;
                justify-content: center;

                a {
                  align-self: end;
                }
              `}
            >
              <img
                css={theme =>css`
                  max-width: 500px;
                  max-height: 500px;
                  border: 1px solid ${theme.colors.shadow}
                `}
                alt=''
                src={this.state.imageFile}
              />
              <Icon
                className="comment-form__image-remove-button debut-icon debut-icon--pointer"
                icon="IconX"
                color="#E71D36"
                size={20}
                onClick={this.onCancelImage}
              />
            </div>
          }

          <div
            css={css`
              align-items: center;
              display: flex;
              justify-content: flex-end;
              margin: 7px 0;
              padding-right: 5px;
            `}
          >
            <p
              className="super-small"
              css={theme => css`
                color: ${theme.colors.primary};
                margin-bottom: 0 !important;
              `}
            >
              ({150 - this.state.characterLength})
            </p>
            <Label
              css={css`
                margin-bottom: 2px !important;
              `}
            >
              <Icon
                className="debut-icon debut-icon--pointer ml-half mr-half"
                icon="IconCamera"
                size={15}
                />
              <input
                type="file"
                onChange={this.storeFile}
                hidden
                accept="image/*"
                ref={fileInput => this.fileInput = fileInput}
                />
            </Label>
            { commentActions.submitting &&
              shareId === commentActions.shareId &&
              <BulmaLoader
                css={css`
                  position: absolute;
                  bottom: 6px;
                  right: -10px;
                `}
              />
            }
          </div>
          {
            editMode &&
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: flex-end;
              `}
            >
              { commentActions.editing && <BulmaLoader className="mr-one" />}
              <SubmitFooter
                onCancel={this.onCancel}
                onSubmit={this.onSubmit}
                submitting={commentActions.editing}
              />
            </div>
          }
        </form>
        {
          this.state.showEmojis ?
          <span
            className="emoji-wrapper"
            css={theme => emojiStyles.emojiPickerStyles(editMode)}
            ref={el => (this.emojiPicker = el)}
          >
            <Picker onSelect={this.addEmoji} />
          </span>
          :
          <p
            className="emoji-wrapper"
            css={theme => emojiStyles.emojiButtonStyles(editMode)}
            onClick={this.showEmojis}
          >
            {String.fromCodePoint(0x1f60a)}
          </p>
        }
      </div>
    )
  }
}

CommentForm.defaultProps = {
  onCancel: _.noop,
  onComplete: _.noop,
}

const mapStateToProps = (state) => {
  const submitting = state.share.commentActions.submitting
  const editing = state.share.commentActions.editing
  const shareId = state.share.commentActions.shareId

  const commentActions = {
    submitting,
    editing,
    shareId
  }

  return {
    commentActions
  }
}

export default connect(mapStateToProps, {
  requestCreateComment,
  requestEditComment,
})(CommentForm)
