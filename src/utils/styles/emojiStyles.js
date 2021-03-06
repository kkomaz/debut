import { css } from '@emotion/core'

export const emojiPickerStyles = (from) => {
  if (from === 'profile') {
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

export const emojiPickerCommentStyles = (from) => {
  if (from === 'profile') {
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

export const emojiButtonStyles = () => {
  return css`
    position: absolute;
    bottom: 39px;
    right: 0;
    z-index: 1;
    cursor: pointer;
  `
}

export const emojiCommentButtonStyles = () => {
  return css`
    position: absolute;
    bottom: 2px;
    right: 0;
    z-index: 1;
    cursor: pointer;
  `
}

const emojiStyles = {
  emojiPickerStyles,
  emojiButtonStyles,
  emojiPickerCommentStyles,
  emojiCommentButtonStyles,
}

export default emojiStyles
