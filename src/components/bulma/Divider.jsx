/** @jsx, jsx */
import React from 'react'
import { css } from '@emotion/core'

const Divider = (styles) => {
  return (
    <div
      className="is-divider"
      css={theme => css`
        border-top: 1px solid ${theme.colors.shadow};
        margin-top: ${styles.marginTop} !important;
        margin-bottom: ${styles.marginBottom} !important;
      `}
    >
    </div>
  )
}

Divider.defaultProps = {
  styles: {
    marginTop: '0',
    marginBottom: '0'
  }
}

export default Divider
