// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

// Model Imports
import _ from 'lodash'
import { Card } from 'components/bulma'
import { User } from 'radiks'
import Follow from 'model/follow'
import Share from 'model/share'

// Component Import
import { ShareListItem } from 'components/Share'

// Action Imports
import { requestFetchShareFeeds } from 'actions/feed'

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
    console.log(share)
    console.log(this.props.feedShares.list)
  }

  render() {
    const { feedShares } = this.props
    console.log(feedShares)
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

const mapStateToProps = (state) => {
  const feedShares = state.feed.shares

  return {
    feedShares
  }
}

export default withRouter(connect(mapStateToProps, {
  requestFetchShareFeeds,
})(AdminActivityFeed))
