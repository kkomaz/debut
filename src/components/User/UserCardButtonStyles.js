import { css } from '@emotion/core'

const UserCardButtonStyles = (theme) => {
  return css`
    min-width: 90px;

    &:hover {
      border: 1px solid ${theme.colors.blue};
      color: ${theme.colors.blue};
    }
  `
}

export default UserCardButtonStyles
