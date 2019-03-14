import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { Card, Content } from 'components/bulma'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import { Icon } from 'components/icon'
import { UserContext } from 'components/User/UserProvider'
import { requestDeleteShare } from 'actions/share'
import { requestShareComments } from 'actions/comment'
import { connect} from 'react-redux'
import { CommentForm, CommentListItem } from 'components/comment'
import { BulmaLoader } from 'components/bulma'
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
  state = {
    showDeleteConfirmation: false
  }

  static propTypes = {
    cardClass: PropTypes.string.isRequired,
    share: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    onEditClick: PropTypes.func,
    onCommentEditClick: PropTypes.func,
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

  fetchShareComments = () => {
    const { share } = this.props
    this.props.requestShareComments({
      share_id: share._id,
      offset: _.get(share, 'comments.length', 0)
    })
  }

  render() {
    const { cardClass, share, username, deleting } = this.props
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
    })

    const shareListeItemContentClass = classNames({
      'share-list-item__card-content': true,
      'share-list-item__card-content--text-only': !share.imageFile
    })

    return (
      <Card key={share._id} className={shareListItemClass}>
        <Card.Content className={shareListeItemContentClass}>
          <Content style={{ marginBottom: '0' }}>
            <div className="share-list-item__user-details" style={{ position: 'relative' }}>
              <p><strong>{username}</strong> <span className="admin-username__date small">- {formatDate(share.createdAt)}</span></p>
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
                        { deleting && <BulmaLoader className="mr-one" /> }
                        <p className="cursor small mr-half share-list-item__delete" onClick={this.deleteShare}>DELETE</p>
                        <p className="cursor small share-list-item__cancel" onClick={this.revertDelete}>CANCEL</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <p className={shareListItemTextClass}>
              {linkifyText(share.text)}
            </p>

            {
              share.imageFile &&
              <div className="share-list-item__image-container">
                <img alt='' src={share.imageFile} />
              </div>
            }
            </Content>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              {
                share.commentCount && share.commentCount !== _.get(share, 'comments.length', 0) &&
                <p
                  onClick={this.fetchShareComments}
                  className="small share-list-item__view-more-comments"
                  >
                  View Comments
                </p>
              }
              <p className="small">
                {_.get(share, 'commentCount', 0)} comments
              </p>
            </div>
          </Card.Content>
          <Card.Content style={{ padding: '0' }}>
            <Content>
              {
                _.map(_.get(share, 'comments', []), (comment, index) => {
                  return (
                    <CommentListItem
                      comment={comment}
                      key={comment._id}
                      sessionUser={sessionUser}
                      share={share}
                      username={username}
                      onEditClick={this.props.onCommentEditClick}
                    />
                  )
                })
              }
              <div className="is-divider" style={{ borderTop: '1px solid #E0E3DA', marginTop: '0' }}></div>

              <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>

              <CommentForm
                shareId={share._id}
                username={sessionUser.username}
              />
            </div>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

ShareListItem.defaultProps = {
  onEditClick: _.noop,
}

const mapStateToProps = (state) => {
  const deleting = state.share.shareActions.deleting

  return {
    deleting
  }
}

ShareListItem.contextType = UserContext
export default connect(mapStateToProps, {
  requestDeleteShare,
  requestShareComments,
})(ShareListItem)
