import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import {
  Card,
} from 'components/bulma'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import './ShareListItem.scss'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}
class ShareListItem extends Component {
  render() {
    const { cardClass, share, username } = this.props
    const { sessionUser } = this.context.state

    const shareListItemClass = classNames({
      [cardClass]: true,
      'share-list-item': true
    })

    return (
      <Card key={share._id} className={shareListItemClass}>
        <Card.Content>
          <div className="share-list-item__user-details">
            <p><strong>{username}</strong> <span className="admin-username__date small">- {formatDate(share.createdAt)}</span></p>
            {
              _.isEqual(sessionUser.username, username) &&
              <div className="share-list-item__edit-delete ml-one">
                <Icon
                  className="debut-icon debut-icon--pointer mr-half"
                  icon="IconPencil"
                />
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconTrash"
                />
              </div>
            }
          </div>
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
}

ShareListItem.propTypes = {
  cardClass: PropTypes.string.isRequired,
  share: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}
ShareListItem.contextType = UserContext
export default ShareListItem
