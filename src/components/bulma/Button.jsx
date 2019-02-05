import React, { Component } from 'react'
import Button from 'react-bulma-components/lib/components/button'
import PropTypes from 'prop-types'

export default class DebutButton extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render() {
    const { children, color } = this.props

    return (
      <Button
        {...this.props}
        style={{ color: color && 'white' }}
      >
        {children}
      </Button>
    )
  }
}
