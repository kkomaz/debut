// Library Imports
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

// Model Imports
import Share from 'model/share'

// Component Import
import { ShareListItem, AdminNoShares } from 'components/Share'

// Action Imports
import { requestAddShareFeeds, requestFetchShareFeeds } from 'actions/share'

// Stylesheets
import './AdminActivityFeed.scss'

class AdminActivityFeed extends Component {
  static propTypes = {
    userFollow: PropTypes.object.isRequired,
    feedShares: PropTypes.object.isRequired,
  }

  componentDidMount = async () => {
    this.props.requestFetchShareFeeds(this.props.userFollow)
    Share.addStreamListener((share) => {
      this.addShareToActivites(share)
    })
  }

  addShareToActivites(share) {
    const { userFollow, feedShares } = this.props
    if (_.includes(userFollow.following, share.attrs.username) && !_.find(feedShares.list, (feedShare) => feedShare._id === share._id)) {
      this.props.requestAddShareFeeds(share.attrs)
    }
  }

  render() {
    const { feedShares } = this.props

    if (!feedShares.loading && feedShares.list.length === 0) {
      return <AdminNoShares />
    }

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
              />
            )
          })
        }
        </CSSTransitionGroup>
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
