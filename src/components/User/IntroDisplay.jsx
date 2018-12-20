import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

const introDisplay = (props) => {
  const description = _.isEmpty(props.description) ? 'Add some info!' : props.description

  return (
    <div className="user-intro-display">
      <p>
        {description}
      </p>
    </div>
  )
}

introDisplay.propTypes = {
  description: PropTypes.string,
}

export default introDisplay
