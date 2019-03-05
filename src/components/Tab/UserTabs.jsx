import React, { Component } from 'react'
import { Tabs } from 'components/bulma'
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
          Following
        </Tabs.Tab>
        <Tabs.Tab
          className="user-tabs__tab"
          active={active === 'followers'}
          onClick={() => this.onClick('followers')}
        >
          Followers
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default UserTabs
