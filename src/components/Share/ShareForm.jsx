/** @jsx jsx */

// Library Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import PropTypes from 'prop-types'
import { Picker } from 'emoji-mart'

// Component Imports
import {
  BulmaLoader,
  Field,
  Label,
  Help,
} from 'components/bulma'
import SubmitFooter from 'components/UI/Form/SubmitFooter'
import { requestCreateShare } from 'actions/share'
import { Icon } from 'components/icon'

// Util Imports
import toggleNotification from 'utils/notifier/toggleNotification'
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
      showEmojis: false,
      textAreaRow: stringRows > 0 ? stringRows + 1 : 3,
    }
    this.textarea = React.createRef();
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    currentShare: PropTypes.shape({
      _id: PropTypes.string,
      text: PropTypes.string,
      imageFile: PropTypes.string,
    }),
    from: PropTypes.string,
  }

  componentDidMount() {
    document.addEventListener('input', this.handleCursorPosition.bind(this), true);
    document.addEventListener('click', this.handleCursorPosition.bind(this), true)
  }

  componentDidUpdate(prevProps, prevState) {
    const currentTextLines = (this.state.text.match(/\n/g)||[]).length
    const prevTextLines = (prevState.text.match(/\n/g)||[]).length

    if (currentTextLines === 0 && prevTextLines > 0) {
      this.setState({ textAreaRow: 3 })
    }

    if (currentTextLines < prevTextLines && currentTextLines >= 1) {
      const difference = prevTextLines - currentTextLines
      this.setState({ textAreaRow: this.state.textAreaRow - difference })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('input', this.handleCursorPosition.bind(this), true);
    document.removeEventListener('click', this.handleCursorPosition.bind(this), true)
  }

  handleCursorPosition(e) {
    if (e.target === this.textarea.current) {
      const { valid } = this.state

      if (!valid) {
        this.setState({ valid: true })
      }

      this.setState({
        [e.target.name]: e.target.value,
        characterLength: e.target.value.length,
        curserPositonStart: e.target.selectionStart,
        curserPositonEnd: e.target.selectionEnd
      })
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
    const textareaStrParts = [
        `${this.textarea.current.value.substring(0, this.state.curserPositonStart)}`,
        `${emojiPic}`,
        `${this.textarea.current.value.substring(this.state.curserPositonEnd, this.length)}`,
      ];

    const textareaValue = textareaStrParts.join('');

    this.setState({
       text: textareaValue
    })
  }
  // Emoji functions - end

  onChange = (e) => {
    const { valid } = this.state

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

    this.setState({ textAreaRow: 3 })
    return this.createShare()
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

    this.props.requestCreateShare(username, params)
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
    this.fileInput.value = ''
    this.setState({
      imageFile: ''
    })

    this.props.onCancel()
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
    const { valid } = this.state
    const { submitting } = this.props

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
            <textarea
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
                width: 100%;
                resize: none;
                padding: 10px;
              `}
              style={{
                fontFamily: 'Poppins, sans-serif',
              }}
              ref={this.textarea}
            ></textarea>
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
                  className="debut-icon debut-icon--pointer mr-half"
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
          </div>
        </form>
        {
          this.state.showEmojis ?
          <span
            className="emoji-wrapper"
            css={theme => emojiStyles.emojiPickerStyles(this.props.from)}
            ref={el => (this.emojiPicker = el)}
          >
            <Picker onSelect={this.addEmoji} />
          </span>
          :
          <p
            className="emoji-wrapper"
            css={theme => emojiStyles.emojiButtonStyles(this.props.from)}
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
  from: '',
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
})(ShareForm)
