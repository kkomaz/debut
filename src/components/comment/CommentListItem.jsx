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
import { withRouter } from 'react-router-dom'
import './CommentListItem.scss';

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

  onUserClick = () => {
    const { history, comment } = this.props

    history.push(`/${comment.creator}`)
  }

  render() {
    const { cardClass, username, comment } = this.props
    const { sessionUser } = this.context.state
    const { showDeleteConfirmation } = this.state

    const commentListItemClass = classNames({
      'comment-list-item': true
    }, cardClass)

    const commentListItemTextClass = classNames({
      'comment-list-item__text': true,
      'mt-quarter': !showDeleteConfirmation,
      'comment-list-item__text--show-delete': showDeleteConfirmation,
      'small': true
    })

    return (
      <div className={commentListItemClass}>
        <div className="comment-list-item__user-details" style={{ position: 'relative' }}>
          <p><strong onClick={this.onUserClick} className="comment-list-item__username-creator">{comment.creator}</strong> <span className="admin-username__date small">- {formatDate(comment.createdAt)}</span></p>
          {
            _.isEqual(sessionUser.username, username) &&
            <div className="comment-list-item__edit-delete">
              <div className="comment-list-item__edit-delete-icons ml-one">
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
                <div className="comment-list-item__delete-confirmation">
                  <p className="comment-list-item__delete-confirmation-text small">
                    Are you sure you want to delete this moment?
                  </p>
                  <div className="comment-list-item__delete-yes-no">
                    <p className="cursor small mr-half comment-list-item__delete" onClick={this.deleteShare}>DELETE</p>
                    <p className="cursor small comment-list-item__cancel" onClick={this.revertDelete}>CANCEL</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <p className={commentListItemTextClass}>{linkifyText(comment.text)}</p>

        {
          comment.imageFile &&
          <div className="comment-list-item__image-container">
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

export default withRouter(connect(null, {})(CommentListItem))

CommentListItem.contextType = UserContext
