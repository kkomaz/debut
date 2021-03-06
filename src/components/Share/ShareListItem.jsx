import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
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
import Popover, { ArrowContainer } from 'react-tiny-popover'
import './ShareListItem.scss'
import { ShareAdminMenu } from 'components/Share'

// Component Imports
import { ActionableContainer } from 'components/actionables'

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
    showDeleteConfirmation: false,
    isPopoverOpen: false,
    commentView: false,
  }

  static propTypes = {
    cardClass: PropTypes.string.isRequired,
    disableGoPath: PropTypes.bool,
    from: PropTypes.string,
    onCommentEditClick: PropTypes.func,
    share: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  revertDelete = () => {
    this.setState({ showDeleteConfirmation: false })
  }

  setDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true })
  }

  deleteShare = () => {
    const { share } = this.props
    this.props.requestDeleteShare(share)
  }

  fetchShareComments = () => {
    const { share } = this.props
    this.setState({ commentView: true })
    this.props.requestShareComments({
      share_id: share._id,
      offset: _.get(share, 'comments.length', 0)
    })
  }

  goToUserProfile = () => {
    const { history, username } = this.props

    return history.push(`/${username}`)
  }

  renderEditablePopover = () => {
    const { sessionUser } = this.context.state
    const { share, username, disableGoPath } = this.props

    if (!_.isEqual(sessionUser.username, username)) {
      if (disableGoPath) {
        return null
      }

      return (
        <Popover
            isOpen={this.state.isPopoverOpen}
            position="right"
            padding={30}
            onClickOutside={() => this.setState({ isPopoverOpen: false })}
            content={({ position, targetRect, popoverRect }) => (
              <ArrowContainer
                position={position}
                targetRect={targetRect}
                popoverRect={popoverRect}
                arrowColor={'#383A3F'}
                arrowSize={10}
              >
                <ShareAdminMenu
                  disableGoPath={disableGoPath}
                  disableAdminPath
                  onDeleteClick={this.setDeleteConfirmation}
                  username={username}
                  share={share}
                />
              </ArrowContainer>
            )}
        >
          <Icon
            className="debut-icon debut-icon--pointer"
            icon="IconDots"
            onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
            size={16}
            linkStyles={{
              position: 'absolute',
              top: '0',
              right: '11px',
              height: '30px'
            }}
          />
        </Popover>
      )
    }

    return (
      <Popover
          isOpen={this.state.isPopoverOpen}
          position="right"
          padding={30}
          onClickOutside={() => this.setState({ isPopoverOpen: false })}
          content={({ position, targetRect, popoverRect }) => (
              <ArrowContainer
                position={position}
                targetRect={targetRect}
                popoverRect={popoverRect}
                arrowColor={'#383A3F'}
                arrowSize={10}
              >
                {
                  _.isEqual(sessionUser.username, username) &&
                  <ShareAdminMenu
                    disableGoPath={disableGoPath}
                    onDeleteClick={this.setDeleteConfirmation}
                    username={username}
                    share={share}
                  />
                }
              </ArrowContainer>
          )}
      >
        <Icon
          className="debut-icon debut-icon--pointer"
          icon="IconDots"
          onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
          size={16}
          linkStyles={{
            position: 'absolute',
            top: '0',
            right: '11px',
            height: '30px'
          }}
        />
      </Popover>
    )
  }

  toggleCommentView = () => {
    return this.setState({ commentView: !this.state.commentView })
  }

  render() {
    const { cardClass, share, username, deleting, currentComment } = this.props
    const { sessionUser } = this.context.state
    const { showDeleteConfirmation, commentView } = this.state

    const shareListItemClass = classNames({
      'share-list-item': true
    }, cardClass)

    const shareListItemTextClass = classNames({
      'share-list-item__text': true,
      'share-list-item__text--show-delete': showDeleteConfirmation,
      'mt-half': true,
    })

    const shareListeItemContentClass = classNames({
      'share-list-item__card-content': true,
      'share-list-item__card-content--text-only': !share.imageFile
    })

    const voter = _.find(share.votes, (vote) => vote.username === sessionUser.username)

    return (
      <Card key={share._id} className={shareListItemClass}>
        <Card.Content className={shareListeItemContentClass}>
          <Content style={{ marginBottom: '50px' }}>
            <div className="share-list-item__user-details" style={{ position: 'relative' }}>
              <div>
                <p className="share-list-item__username-date" onClick={this.goToUserProfile}>
                  <strong className="share-list-item__username">{username}</strong> <span className="admin-username__date small">- {formatDate(share.createdAt)}</span>
                </p>
                {this.renderEditablePopover()}
              </div>
            </div>

            {
              _.isEqual(sessionUser.username, username) && showDeleteConfirmation &&
              <div className="share-list-item__delete-confirmation">
                <p className="share-list-item__delete-confirmation-text small">
                  Are you sure you want to delete this moment?
                </p>
                <div className="share-list-item__delete-yes-no ml-one">
                  <p className="cursor small mr-half share-list-item__delete" onClick={this.deleteShare}>DELETE</p>
                  <p className="cursor small share-list-item__cancel ml-half mr-one" onClick={this.revertDelete}>CANCEL</p>
                  { deleting && <BulmaLoader /> }
                </div>
              </div>
            }

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
            <ActionableContainer
              detailObj={share}
              voter={voter || {}}
              toggleComment={this.toggleCommentView}
              type="share"
            />
          </Card.Content>
          <Card.Content style={{ padding: '0' }}>
            <Content>
              {
                commentView && _.map(_.get(share, 'comments', []), (comment, index) => {
                  return (
                    <CommentListItem
                      comment={comment}
                      key={comment._id}
                      sessionUser={sessionUser}
                      share={share}
                      username={username}
                      onEditClick={this.props.onCommentEditClick}
                      index={index}
                    />
                  )
                })
              }
              <div className="is-divider" style={{ borderTop: '1px solid #E0E3DA', marginTop: '0' }}></div>

              <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>

              <CommentForm
                shareId={share._id}
                username={sessionUser.username}
                currentComment={currentComment}
                from={this.props.from}
              />
            </div>
          </Content>
        </Card.Content>
      </Card>
    )
  }
}

ShareListItem.defaultProps = {
  disableGoPath: false,
  from: '',
}

const mapStateToProps = (state) => {
  const deleting = state.share.shareActions.deleting

  return {
    deleting
  }
}

ShareListItem.contextType = UserContext
export default withRouter(connect(mapStateToProps, {
  requestDeleteShare,
  requestShareComments,
})(ShareListItem))
