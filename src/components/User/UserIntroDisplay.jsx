import React from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
} from 'components/bulma'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import moment from 'moment'
import './UserIntroDisplay.scss'

const UserIntroDisplay = (props) => {
  const { user } = props

  return (
    <div className="user-intro-display">
      <div className="user-intro-display__identity mb-one">
        {user.name ?
        <Heading
          className="user-intro-display__name"
          size={6}>
            {user.name}
        </Heading> :
        <Heading
          className="user-intro-display__name"
          size={6}>
            {user.username}
        </Heading>
        }
        {/*
          <p className="mt-half user-intro-display__username">{linkifyText(`@${user.username}`)}</p>
        */}
      </div>
      {
        user.description &&
        <p className="user-intro-display__description">
          {linkifyText(user.description)}
        </p>
      }
      {
        user.area &&
        <div className="user-intro-display__area">
          <Icon
            className="debut-icon mr-one mb-half"
            icon="IconLocation"
            size={20}
          />
          <p>{user.area}</p>
        </div>
      }
      {
        user.websiteUrl &&
        <div className="user-intro-display__website">
          <Icon
            className="debut-icon mr-one mb-half"
            icon="IconDisplay"
            size={20}
          />
          <p>{linkifyText(user.websiteUrl)}</p>
        </div>
      }

      <div className="user-intro-display__joined">
        <Icon
          className="debut-icon mr-one"
          icon="IconCalendar"
          size={20}
        />
        <p>Joined {moment(user.createdAt).format('MM/YYYY')}</p>
      </div>
    </div>
  )
}

UserIntroDisplay.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    area: PropTypes.string,
    websiteUrl: PropTypes.string,
  }).isRequired
}

export default UserIntroDisplay
