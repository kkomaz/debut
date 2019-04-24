// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Action Imports
import { requestFetchTasks } from 'actions/task'

// Component Imports
import TwitterEarnCard from './TwitterEarnCard'

class AprilEarn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      valid: props.currentMonth === 3
    }
  }

  static propTypes = {
    currentMonth: PropTypes.number.isRequired,
    sessionUser: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.requestFetchTasks(3)
  }

  render() {
    const { sessionUser } = this.props

    return (
      <div>
        <TwitterEarnCard
          valid={this.state.valid}
          sessionUser={sessionUser}
        />
      </div>
    )
  }
}

export default connect(null, {
  requestFetchTasks,
})(AprilEarn)
