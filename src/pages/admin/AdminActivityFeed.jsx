// Library Imports
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import {
  Modal,
  Section,
  Heading,
} from 'components/bulma'
// Model Imports
import Share from 'model/share'

// Component Import
import { ShareListItem, AdminNoShares } from 'components/Share'
import { CommentForm } from 'components/comment'

// Action Imports
import { requestAddShareFeeds, requestFetchShareFeeds } from 'actions/share'

// Stylesheets
import './AdminActivityFeed.scss'

class AdminActivityFeed extends Component {
  constructor(props) {
    super(props)


    this.state = {
      bottomReached: false,
      showCommentModal: false,
      currentComment: {},
    }

    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    userFollow: PropTypes.object.isRequired,
    feedShares: PropTypes.object.isRequired,
  }

  componentDidMount = async () => {
    this.props.requestFetchShareFeeds(this.props.userFollow)
    Share.addStreamListener((share) => {
      this.addShareToActivites(share)
    })
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  addShareToActivites(share) {
    const { userFollow, feedShares } = this.props
    if (_.includes(userFollow.following, share.attrs.username) && !_.find(feedShares.list, (feedShare) => feedShare._id === share._id)) {
      this.props.requestAddShareFeeds(share.attrs)
    }
  }

  openCommentModal = (comment) => {
    return this.setState({ showCommentModal: true, currentComment: comment })
  }

  closeCommentModal = () => {
    return this.setState({ showCommentModal: false })
  }

  handleScroll = () => {
    const { bottomReached } = this.state
    const html = document.documentElement; // get the html element
    // window.innerHeight - Height (in pixels) of the browser window viewport including, if rendered, the horizontal scrollbar.
    // html.offsetHeight - read-only property returns the height of an element, including vertical padding and borders, as an integer.
    const windowHeight = "innerHeight" in window ? window.innerHeight : html.offsetHeight;
    const body = document.body; // get the document body
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); // Find the max value of the overall doc
    const windowBottom = windowHeight + window.pageYOffset; // Viewport + height offset post scroll

    /**
     * if windowBottom is larger then you know you reached the bottom
    */
    if (windowBottom >= docHeight) {
      this.setState({ bottomReached: true })
      // this.setState({ bottomReached: true }, () => {
      //   if (!this.state.full) {
      //     this.fetchUsers()
      //   }
      // });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }

  render() {
    const { feedShares } = this.props
    const { showCommentModal } = this.state

    if (!feedShares.loading && feedShares.list.length === 0) {
      return <AdminNoShares />
    }

    console.log(this.state.bottomReached)

    return (
      <div className="admin-activity-feed">
        <CSSTransitionGroup
          transitionName="admin-activity-feed-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
        {
          _.map(feedShares.list, (feedShare, index) => {
            const cardClass = _.isEqual(index, 0) ? '' : 'mt-one'

            return (
              <ShareListItem
                key={feedShare._id}
                cardClass={cardClass}
                className="admin-activity-feed__share"
                share={feedShare}
                username={feedShare.username}
                onCommentEditClick={this.openCommentModal}
              />
            )
          })
        }
        </CSSTransitionGroup>
        {
          showCommentModal &&
          <Modal
            show={showCommentModal}
            onClose={this.closeModal}
            closeOnEsc
            >
            <Modal.Content>
              <Section style={{ backgroundColor: 'white' }}>
                <Heading size={4}>User Comments</Heading>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {userFollow } = ownProps
  const list = _.filter(state.share.shares.list, (share) => _.includes(userFollow.following, share.username))
  const feedShares = { ...state.share.shares, list }

  return {
    feedShares
  }
}

export default withRouter(connect(mapStateToProps, {
  requestFetchShareFeeds,
  requestAddShareFeeds,
})(AdminActivityFeed))
