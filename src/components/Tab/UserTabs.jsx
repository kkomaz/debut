import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Tabs } from 'components/bulma'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './UserTabs.scss'

class UserTabs extends Component {
  state = {
    activeTab: 'profile'
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }

  setActiveTab = (value) => {
    const { username } = this.props

    this.setState({ activeTab: value }, () => {
      if (value === 'profile') {
        return this.props.history.push(`/${username}`)
      }

      return this.props.history.push(`/${username}/${value}`)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.username !== this.props.username) {
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

export default withRouter(connect(mapStateToProps)(UserTabs))
