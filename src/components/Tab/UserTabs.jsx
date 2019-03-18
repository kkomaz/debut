import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Tabs } from 'components/bulma'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RootContext } from 'components/context/DebutContext'
import './UserTabs.scss'

class UserTabs extends Component {
  constructor(props) {
    super(props)

    let activeTab
    activeTab = _.last(props.history.location.pathname.split('/'))
    const followArray = ['following', 'followers']

    if (!_.includes(followArray, activeTab)) {
      activeTab = 'profile'
    }

    this.state = {
      activeTab
    }
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }

  static contextType = RootContext

  setActiveTab = (value) => {
    const { username } = this.props

    this.setState({ activeTab: value }, () => {
      if (value === 'profile') {
        return this.props.history.push(`/user/${username}`)
      }

      return this.props.history.push(`/user/${username}/${value}`)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.username !== this.props.username || this.context.state.profileClicked) {
      if (this.context.state.profileClicked) {
        this.context.setProfileClickedFalse()
      }

      this.setActiveTab('profile')
    }
  }

  render() {
    const { viewedFollow } = this.props
    const { activeTab } = this.state

    return (
      <Tabs
        className="user-tabs"
        type='boxed'
        fullwidth
        align="right"
      >
        <Tabs.Tab
          className="user-tabs__tab"
          active={activeTab === 'profile'}
          onClick={() => this.setActiveTab('profile')}
        >
          Profile
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={activeTab === 'following'}
          onClick={() => this.setActiveTab('following')}
        >
          Following {_.get(viewedFollow, 'followingCount', 0)}
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={activeTab === 'followers'}
          onClick={() => this.setActiveTab('followers')}
        >
          Followers {_.get(viewedFollow, 'followersCount', 0)}
        </Tabs.Tab>
      </Tabs>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    viewedFollow: state.follow[ownProps.username] || {}
  }
}

export default withRouter(connect(mapStateToProps)(UserTabs))
