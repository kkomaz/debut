import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Content,
} from 'components/bulma'

const noShares = ({ username }) => {
  return (
    <Card>
      <Card.Content>
        <Content>
          <p>{username} is not sharing any moments at this time!</p>
        </Content>
      </Card.Content>
    </Card>
  )
}

noShares.propTypes = {
  username: PropTypes.string.isRequired,
}

export default noShares
