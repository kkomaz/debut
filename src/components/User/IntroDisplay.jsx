import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { linkifyText } from 'utils/decorator'

const generateDescription = (props) => {
  if (props.adminMode) {
    return _.isEmpty(props.description) ? 'Add a short bio to tell people more about yourself.' : props.description
  }

  return _.isEmpty(props.description) ? 'Bio is currently empty.' : props.description
}

const introDisplay = (props) => {
  const description = generateDescription(props)

  return (
    <div className="user-intro-display">
      <p className="user-intro-display__description">
        {linkifyText(description)}
      </p>
    </div>
  )
}

introDisplay.propTypes = {
  description: PropTypes.string,
}

export default introDisplay
