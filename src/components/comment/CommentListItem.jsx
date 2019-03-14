import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import { requestDeleteComment } from 'actions/comment'
import { connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BulmaLoader } from 'components/bulma'
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
    comment: PropTypes.object.isRequired,
    onEditClick: PropTypes.func,
  }

  revertDelete = () => {
    this.setState({ showDeleteConfirmation: false })
  }

  setDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true })
  }

  onEditClick = () => {
    const { comment } = this.props
    this.props.onEditClick(comment)
  }

  deleteShare = () => {
    const { share, comment } = this.props

    this.props.requestDeleteComment({
      share,
      comment,
    })
  }

  onUserClick = () => {
    const { history, comment } = this.props

    history.push(`/${comment.creator}`)
  }

  render() {
    const { username, comment } = this.props
    const { sessionUser } = this.context.state
    const { showDeleteConfirmation } = this.state

    const commentListItemClass = classNames({
      'comment-list-item': true
    })

    const commentListItemTextClass = classNames({
      'comment-list-item__text': true,
      'mt-quarter': !showDeleteConfirmation,
      'comment-list-item__text--show-delete': showDeleteConfirmation,
      'small': true
    })

    return (
      <div className={commentListItemClass}>
        <div className="comment-list-item__user-details" style={{ position: 'relative' }}>

          <p style={{ marginBottom: '0' }}><strong onClick={this.onUserClick} className="comment-list-item__username-creator small">{comment.creator}</strong> <span className="admin-username__date small">- {formatDate(comment.createdAt)}</span></p>
          {
            _.isEqual(sessionUser.username, username) && !_.isEqual(comment.creator, sessionUser.username) &&
            <div className="comment-list-item__edit-delete">
              <div className="comment-list-item__edit-delete-icons ml-one">
                <Icon
                  className="debut-icon debut-icon--pointer"
                  icon="IconTrash"
                  onClick={this.setDeleteConfirmation}
                />
              </div>
            </div>
          }

          {
            !_.isEqual(sessionUser.username, username) && _.isEqual(comment.creator, sessionUser.username) &&
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
            </div>
          }

          {
            _.isEqual(sessionUser.username, username) && _.isEqual(comment.creator, sessionUser.username) &&
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
            </div>
          }

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

export default withRouter(connect(null, {
  requestDeleteComment,
})(CommentListItem))

CommentListItem.contextType = UserContext
