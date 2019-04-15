// Library Imports
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { Card, Button } from 'components/bulma'
import classNames from 'classnames';

// Model Imports
import Share from 'model/share'
import Mention from 'model/mention'

// Component Import
import { ShareListItem, AdminNoShares, ShareForm } from 'components/Share'
import { BarLoader } from 'components/Loader'
import { BulmaLoader } from 'components/bulma'

// Action Imports
import {
  requestAddShareFeeds,
  requestFetchShareFeeds,
  requestDisplayHiddenShares,
  resetSharesFeed,
} from 'actions/share'

// Stylesheets
import './AdminActivityFeed.scss'

class AdminActivityFeed extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bottomReached: false,
      showShareModal: false,
      showCommentModal: false,
      currentComment: {},
      currentShare: {},
      showMoreOptions: false,
    }

    this.handleScroll = _.debounce(this.handleScroll, 300)
  }

  static propTypes = {
    userFollow: PropTypes.object.isRequired,
    feedShares: PropTypes.shape({
      list: PropTypes.array.isRequired,
      full: PropTypes.bool.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired
  }

  componentDidMount = async () => {
    const { userFollow } = this.props

    this.props.resetSharesFeed()

    this.props.requestFetchShareFeeds({
      follow: userFollow,
    })

    Share.addStreamListener(this.addShareToActivites)
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    Share.removeStreamListener(this.addShareToActivites)
    window.removeEventListener('scroll', this.handleScroll)
  }

  addShareToActivites = (share) => {
    const { userFollow, feedShares } = this.props
    if (_.includes(userFollow.following, share.attrs.username) && !_.find(feedShares.list, (feedShare) => feedShare._id === share._id)) {
      if (!this.state.showMoreOptions) {
        this.setState({ showMoreOptions: true })
      }
      this.props.requestAddShareFeeds(share.attrs)
    }
  }

  requestFetchShareFeeds = ({ follow, offset }) => {
    const { feedShares } = this.props
    const share = _.last(feedShares.list)

    this.props.requestFetchShareFeeds({
      follow,
      lt: _.get(share, 'createdAt', null),
    })
  }

  handleScroll = () => {
    const { bottomReached } = this.state
    const { feedShares, userFollow } = this.props
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
      this.setState({ bottomReached: true }, () => {
        if (!feedShares.full) {
          this.requestFetchShareFeeds({
            follow: userFollow,
            offset: feedShares.list.length,
          })
        }
      });
    } else if ((windowBottom < docHeight) && bottomReached) {
      this.setState({ bottomReached: false });
    }
  }

  showMoreShares = () => {
    this.props.requestDisplayHiddenShares()
    return this.setState({ showMoreOptions: false })
  }

  /**
   * Archived
  */
  openCommentModal = (comment) => {
    return this.setState({ showCommentModal: true, currentComment: comment })
  }

  closeCommentModal = () => {
    return this.setState({ showCommentModal: false })
  }

  closeShareModal = () => {
    this.setState({ showShareModal: false })
  }

  openShareModal = (share) => {
    this.setState({
      showShareModal: true,
      currentShare: {
        _id: share._id,
        text: share.text,
        imageFile: share.imageFile,
      }
    })
  }

  render() {
    const { feedShares, userFollow } = this.props
    const {
      bottomReached,
      // showCommentModal,
      showMoreOptions,
      // showShareModal,
    } = this.state

    if (feedShares.loading) {
      return (
        <div className="admin-activity-feed admin-activity-feed--loading">
          <BulmaLoader />
        </div>
      )
    }

    return (
      <div className="admin-activity-feed">
        {
          !feedShares.loading && feedShares.list.length === 0 && <AdminNoShares className="mb-one" />
        }
        {
          showMoreOptions &&
          <ReactCSSTransitionReplace
            transitionName="admin-activity-feed-show-more"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={100}
          >
            <div className="admin-activity-feed__show-more">
              <p onClick={this.showMoreShares}>Show more shared moments</p>
            </div>
          </ReactCSSTransitionReplace>
        }

        <Card className="mb-one">
          <Card.Content>
            <ShareForm username={userFollow.username} />
          </Card.Content>
        </Card>

        <CSSTransitionGroup
          transitionName="admin-activity-feed-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
        {
          _.map(feedShares.list, (feedShare, index) => {
            const cardClass = classNames({
              'mt-one': !_.isEqual(index, 0),
              'admin-activity-feed__share': true,
              'admin-activity-feed__share--hidden': feedShare.hidden,
            })

            return (
              <ShareListItem
                key={feedShare._id}
                cardClass={cardClass}
                share={feedShare}
                username={feedShare.username}
              />
            )
          })
        }
        {
          bottomReached && feedShares.list.length >= 5 && !feedShares.full && <BarLoader style={{ height: '200px' }} />
        }
        </CSSTransitionGroup>
        {/*
          <Modal
            show={showShareModal}
            onClose={this.closeShareModal}
            closeOnEsc
          >
            <Modal.Content>
              <Section style={{ backgroundColor: 'white' }}>
                <Heading size={6}>Shared Moment</Heading>
                <ShareForm
                  username={userFollow.username}
                  currentShare={this.state.currentShare}
                  onCancel={this.closeShareModal}
                  onComplete={this.closeShareModal}
                />
              </Section>
            </Modal.Content>
          </Modal>
        */}

        {/*
          showCommentModal &&
          <Modal
            show={showCommentModal}
            onClose={this.closeModal}
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
        */}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { userFollow } = ownProps
  const list = _.filter(state.share.shares.list, (share) => _.includes([...userFollow.following, userFollow.username], share.username))
  const feedShares = { ...state.share.shares, list }

  return {
    feedShares,
  }
}

export default withRouter(connect(mapStateToProps, {
  requestFetchShareFeeds,
  requestAddShareFeeds,
  requestDisplayHiddenShares,
  resetSharesFeed,
})(AdminActivityFeed))
