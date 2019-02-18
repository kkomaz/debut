import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'react-content-loader'
import { BarLoader } from '.'

const keys = (type) => {
  switch(type) {
    case 'bar-loader':
      return <BarLoader />
    default:
      return <List />
  }
}

export default class Loadable extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    type: PropTypes.string,
  }

  render() {
    const { loading, type } = this.props

    return loading ? keys(type) : this.props.children
  }
}

Loadable.defaultProps = {
  type: ''
}
