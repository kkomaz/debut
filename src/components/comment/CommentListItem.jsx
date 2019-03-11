import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import { requestDeleteShare } from 'actions/share'
import { connect} from 'react-redux'
import 'components/Share/ShareListItem.scss'

const formatDate = (input) => {
  const postedDate = moment(input).fromNow()
  const postedDateArray = postedDate.split(' ')

  if (_.includes(postedDateArray, 'day') || _.includes(postedDateArray, 'days')) {
    return moment(input).utc().format("MMM DD")
  }
  return postedDate
}
class CommentListItem extends Component {
  state = {
    showDeleteConfirmation: false
  }

  static propTypes = {
    cardClass: PropTypes.string.isRequired,
    share: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    onEditClick: PropTypes.func,
  }

  revertDelete = () => {
    this.setState({ showDeleteConfirmation: false })
  }

  setDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true })
  }

  onEditClick = () => {
    const { share } = this.props
    this.props.onEditClick(share)
  }

  deleteShare = () => {
    const { share } = this.props
    this.props.requestDeleteShare(share)
  }

  render() {
    const { cardClass, username, comment } = this.props
    const { sessionUser } = this.context.state
    const { showDeleteConfirmation } = this.state

    const shareListItemClass = classNames({
      [cardClass]: true,
      'share-list-item': true
    })

    const shareListItemTextClass = classNames({
      'share-list-item__text': true,
      'mt-quarter': !showDeleteConfirmation,
      'share-list-item__text--show-delete': showDeleteConfirmation,
      'mb-one': true
    })

    return (
      <div className={shareListItemClass} style={{ border: '1px solid #E0E3DA'}}>
        <div className="share-list-item__user-details" style={{ position: 'relative' }}>
          <p><strong>{username}</strong> <span className="admin-username__date small">- {formatDate(comment.createdAt)}</span></p>
          {
            _.isEqual(sessionUser.username, username) &&
            <div className="share-list-item__edit-delete">
              <div className="share-list-item__edit-delete-icons ml-one">
                <Icon
                  className="debut-icon debut-icon--pointer mr-half"
                  icon="IconPencil"
                  onClick={this.onEditClick}
                />
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconTrash"
                  onClick={this.setDeleteConfirmation}
                />
              </div>
              {
                showDeleteConfirmation &&
                <div className="share-list-item__delete-confirmation">
                  <p className="share-list-item__delete-confirmation-text small">
                    Are you sure you want to delete this moment?
                  </p>
                  <div className="share-list-item__delete-yes-no">
                    <p className="cursor small mr-half share-list-item__delete" onClick={this.deleteShare}>DELETE</p>
                    <p className="cursor small share-list-item__cancel" onClick={this.revertDelete}>CANCEL</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <p className={shareListItemTextClass}>{linkifyText(comment.text)}</p>

        {
          comment.imageFile &&
          <div className="share-list-item__image-container">
            <img alt='' src={comment.imageFile} />
          </div>
        }
      </div>
    )
  }
}

CommentListItem.defaultProps = {
  onEditClick: _.noop,
}

CommentListItem.contextType = UserContext
export default connect(null, {
  requestDeleteShare,
})(CommentListItem)
