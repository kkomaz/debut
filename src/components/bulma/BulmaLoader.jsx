import React from 'react'
import PropTypes from 'prop-types'
import Loader from 'react-bulma-components/lib/components/loader';

const BulmaLoader = (props) => {
  return (
    <Loader
      style={{
        border: `1px solid ${props.color}`,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        ...props.style
      }}
      {...props}
    />
  )
}

BulmaLoader.propTypes = {
  color: PropTypes.string,
}

BulmaLoader.defaultProps = {
  color: '#401457'
}

export default BulmaLoader
