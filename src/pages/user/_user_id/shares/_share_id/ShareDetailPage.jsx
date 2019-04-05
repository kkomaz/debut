// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Columns,
  Container,
  Modal,
  Section,
  Heading,
} from 'components/bulma'

// Model Imports
import Share from 'model/share'

// Action Imports
import { handleDetailShare, removeDetailShare } from 'actions/share'

// Component Imports
import { ShareListItem, InvalidShare } from 'components/Share'
import { RandomUsers } from 'components/User'
import { CommentForm } from 'components/comment'
import { ShareForm } from 'components/Share'

class ShareDetail extends Component {
  state = {
    error: false,
    share: {},
    loading: true,
    showCommentModal: false,
    showShareModal: false,
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired
  }

  componentDidMount = async () => {
    const { match } = this.props

    try {
      const share = await Share.findById(match.params.share_id)

      if (!share) {
        throw new Error('That moment does not exist!')
      }

      const adjustedShare = { ...share,
        attrs: {
          ...share.attrs,
          comments: share.comments,
          votes: share.votes,
        }
      }

      this.props.handleDetailShare(adjustedShare.attrs, false)
    } catch (e) {
      this.setState({ error: true })
    }
  }

  componentWillUnmount() {
    const { share } = this.props
    this.props.removeDetailShare(share)
  }

  openEditModal = (share) => {
    return this.setState({ showShareModal: true, currentShare: share })
  }

  closeShareModal = () => {
    return this.setState({ showShareModal: false })
  }

  openCommentModal = (comment) => {
    return this.setState({ showCommentModal: true, currentComment: comment })
  }

  closeCommentModal = () => {
    return this.setState({ showCommentModal: false })
  }

  render() {
    const { username, share } = this.props
    const { error, showCommentModal, showShareModal } = this.state

    if (error) {
      return (
        <Container>
          <InvalidShare username={username} />
        </Container>
      )
    }

    if (_.isEmpty(share)) {
      return <div>Loading...</div>
    }

    return (
      <React.Fragment>
        <Columns.Column size={6} offset={1}>
          <ShareListItem
            share={share}
            username={username}
            onEditClick={this.openEditModal}
            onCommentEditClick={this.openCommentModal}
            disableGoPath
          />
        </Columns.Column>
        <Columns.Column size={4}>
          <RandomUsers />
        </Columns.Column>
        {
          showCommentModal &&
          <Modal
            show={showCommentModal}
            onClose={this.closeCommentModal}
            closeOnEsc
            >
            <Modal.Content>
              <Section style={{ backgroundColor: 'white' }}>
                <Heading size={6}>User Comments</Heading>
                <CommentForm
                  currentComment={this.state.currentComment}
                  onComplete={this.closeCommentModal}
                  onCancel={this.closeCommentModal}
                  shareId={this.state.currentComment.share_id}
                  username={this.state.currentComment.creator}
                />
              </Section>
            </Modal.Content>
          </Modal>
        }
        {
          showShareModal &&
          <Modal
            show={showShareModal}
            onClose={this.closeModal}
            closeOnEsc
          >
            <Modal.Content>
              <Section style={{ backgroundColor: 'white' }}>
                <Heading size={6}>Shared Moment</Heading>
                <ShareForm
                  username={username}
                  currentShare={this.state.currentShare}
                  onCancel={this.closeShareModal}
                  onComplete={this.closeShareModal}
                />
              </Section>
            </Modal.Content>
          </Modal>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const shares = state.share.shares
  const share = _.find(shares.list, (share) => share._id === ownProps.match.params.share_id)
  const loading = shares.loading

  return {
    share,
    loading
  }
}

export default connect(mapStateToProps, {
  handleDetailShare,
  removeDetailShare,
})(ShareDetail)
