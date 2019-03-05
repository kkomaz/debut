import React, { Component } from 'react'
import _ from 'lodash'
import { Tabs } from 'components/bulma'
import { connect } from 'react-redux'
import './UserTabs.scss'

class UserTabs extends Component {
  state = {
    active: 'profile'
  }

  onClick = (value) => {
    this.setState({ active: value })
  }

  render() {
    const { active } = this.state
    const { viewedFollow } = this.props

    return (
      <Tabs
        className="user-tabs"
        type='boxed'
        fullwidth
        align="right"
      >
        <Tabs.Tab
          className="user-tabs__tab"
          active={active === 'profile'}
          onClick={() => this.onClick('profile')}
        >
          Profile
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={active === 'following'}
          onClick={() => this.onClick('following')}
        >
          Following {_.get(viewedFollow, 'followingCount', 0)}
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={active === 'followers'}
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
