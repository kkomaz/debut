import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import {
  Card,
} from 'components/bulma'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import './ShareListItem.scss'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}

const shareItemListItem = (props) => {
  const { cardClass, share, username } = props

  const shareListItemClass = classNames({
    [cardClass]: true,
    'share-list-item': true
  })

  return (
    <Card key={share._id} className={shareListItemClass}>
      <Card.Content>
        <p><strong>{username}</strong> <span className="admin-username__date small">- {formatDate(share.createdAt)}</span></p>
        <p className="mt-quarter mb-one">{linkifyText(share.text)}</p>
        {
          share.imageFile &&
          <div className="share-list-item__image-container">
            <img alt='' src={share.imageFile} />
          </div>
        }
      </Card.Content>
    </Card>
  )
}

shareItemListItem.propTypes = {
  cardClass: PropTypes.string.isRequired,
  share: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}

export default shareItemListItem
