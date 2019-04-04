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
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import {
  requestCreateShare,
  requestEditShare
} from 'actions/share'
import { Icon } from 'components/icon'
import toggleNotification from 'utils/notifier/toggleNotification'
import { Picker } from 'emoji-mart'
import emojiStyles from 'utils/styles/emojiStyles'

class ShareForm extends Component {
  constructor(props) {
    super(props)

    const { currentShare = { text: '' } } = props

    const stringRows = (currentShare.text.match(/\n/g)||[]).length


    this.state = {
      _id: currentShare._id || '',
      text: currentShare.text || '',
      characterLength: currentShare.text ? currentShare.text.length : 0,
      valid: true,
      imageFile: currentShare.imageFile || '',
      editMode: !_.isEmpty(currentShare._id),
      showEmojis: false,
      textAreaRow: stringRows > 0 ? stringRows + 1 : 2,
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

  componentDidUpdate(prevProps, prevState) {
    const currentTextLines = (this.state.text.match(/\n/g)||[]).length
    const prevTextLines = (prevState.text.match(/\n/g)||[]).length

    if (currentTextLines === 0 && prevTextLines > 0) {
      this.setState({ textAreaRow: 2 })
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
    this.setState({ textAreaRow: 2 })
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
      imageFile: '',
      textAreaRow: 2
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
      if ((this.state.text.match(/\n/g)||[]).length >= 1) {
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
    const { editing, submitting } = this.props

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
          className="share-form"
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
              placeholder="Share a moment here!"
              rows={this.state.textAreaRow}
              value={this.state.text}
              onKeyDown={this.onEnterPress}
              maxLength={150}
              color={valid ? null : 'danger'}
              css={css`
                border-radius: 3px;
                border-color: #E0E3DA;
                font-size: 14px;
              `}
              style={{
                fontFamily: 'Poppins, sans-serif',
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
                css={theme => css`
                  max-width: 500px;
                  max-height: 500px;
                  border: 1px solid ${theme.colors.shadow}
                `}
                alt=''
                src={this.state.imageFile}
              />
              <Icon
                className="share-form__image-remove-button debut-icon debut-icon--pointer"
                icon="IconX"
                color="#E71D36"
                size={20}
                onClick={this.onCancelImage}
              />
            </div>
          }

          <div
            css={css`
              display: flex;
              justify-content: flex-end;
              margin: 7px 0;
              align-items: center;
              padding-right: 5px;
            `}
          >
            <p
              className="super-small"
              css={theme => css`
                color: ${theme.colors.primary};
                margin-bottom: 0 !important;
                margin-right: 10px;
              `}
            >
              ({150 - this.state.characterLength})
            </p>
            <div className="share-form__options">
              <Label>
                <Icon
                  className="debut-icon debut-icon--pointer"
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
            </div>
          </div>

          <div
            css={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            {
              !editMode &&
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                `}
              >
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
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                `}
              >
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
