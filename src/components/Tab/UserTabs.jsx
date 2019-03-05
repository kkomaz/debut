import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Tabs } from 'components/bulma'
import { connect } from 'react-redux'
import './UserTabs.scss'

class UserTabs extends Component {
  static propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
  }

  onClick = (value) => {
    this.props.setActiveTab(value)
  }

  render() {
    const { viewedFollow, activeTab } = this.props

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
          onClick={() => this.onClick('profile')}
        >
          Profile
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={activeTab === 'following'}
          onClick={() => this.onClick('following')}
        >
          Following {_.get(viewedFollow, 'followingCount', 0)}
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={activeTab === 'followers'}
          onClick={() => this.onClick('followers')}
        >
          Followers {_.get(viewedFollow, 'followerCount', 0)}
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

export default connect(mapStateToProps)(UserTabs)
