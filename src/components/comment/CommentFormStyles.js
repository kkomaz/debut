import { css } from '@emotion/core'

export const emojiPickerStyles = (editMode) => {
  console.log(editMode)
  if (editMode) {
    return css`
      position: fixed;
      top: 50%;
      right: 10%;
      transform: translateY(-50%);
    `
  }

  return css`
    position: absolute;
    top: 0;
    right: -339px;
    cursor: pointer;
    z-index: 1;
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

const commentFormStyles = {
  emojiPickerStyles,
  emojiButtonStyles,
}

export default commentFormStyles
