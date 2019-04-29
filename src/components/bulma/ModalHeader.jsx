/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  BulmaLoader,
  Heading,
} from 'components/bulma'
import { Icon } from 'components/icon'

class ModalHeader extends Component {
  static propTypes = {
    headerText: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  render() {
    const {
      headerText,
      loading,
    } = this.props

    return (
      <div
        css={theme => css`
          background: ${theme.colors.white};
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid ${theme.colors.shadow};
          padding: 1em 0;
        `}
      >
        {
          loading ?
          <BulmaLoader /> :
          <React.Fragment>
            <Heading
              size={4}
              css={css`
                margin-bottom: 0 !important;
              `}
              >
                {headerText}
            </Heading>
            <Icon
              className="debut-icon debut-icon--pointer"
              icon="IconX"
              size={25}
              color="8b8687"
              onClick={this.props.closeModal}
            />
          </React.Fragment>
        }
      </div>
    )
  }
}

ModalHeader.defaultProps = {
  loading: false,
}

export default ModalHeader
