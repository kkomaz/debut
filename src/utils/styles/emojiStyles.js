import { css } from '@emotion/core'

export const emojiPickerStyles = (editMode, from) => {
  if (editMode) {
    return css`
      position: fixed;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
      cursor: pointer;

      @media only screen and (max-width: 1087px) {
        top: 90%;
        right: 0;
      }
    `
  }

  if (!editMode && from === 'profile') {
    return css`
      position: absolute;
      top: 50%;
      right: 0;
      cursor: pointer;
      z-index: 1;

      .emoji-mart-emoji {
        span {
          cursor: pointer;
        }
      }

      @media only screen and (max-width: 1087px) {
        right: 0;
      }
    `
  }

  return css`
    position: absolute;
    top: 0;
    right: -339px;
    cursor: pointer;
    z-index: 1;

    .emoji-mart-emoji {
      span {
        cursor: pointer;
      }
    }

    @media only screen and (max-width: 1087px) {
      right: 0;
    }
  `
}

export const emojiPickerCommentStyles = (editMode, from) => {
  if (editMode) {
    return css`
      position: fixed;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
      cursor: pointer;

      @media only screen and (max-width: 1087px) {
        top: 90%;
        right: 0;
      }
    `
  }

  if (!editMode && from === 'profile') {
    return css`
      position: absolute;
      top: 60%;
      right: 0;
      cursor: pointer;
      z-index: 1;

      .emoji-mart-emoji {
        span {
          cursor: pointer;
        }
      }

      @media only screen and (max-width: 1087px) {
        right: 0;
      }
    `
  }

  return css`
    position: absolute;
    top: 0;
    right: -339px;
    cursor: pointer;
    z-index: 1;

    .emoji-mart-emoji {
      span {
        cursor: pointer;
      }
    }

    @media only screen and (max-width: 1087px) {
      right: 0;
    }
  `
}

export const emojiButtonStyles = (editMode) => {
  return css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;
  `
}

const emojiStyles = {
  emojiPickerStyles,
  emojiButtonStyles,
  emojiPickerCommentStyles,
}

export default emojiStyles
