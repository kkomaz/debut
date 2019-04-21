import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
  }

  render() {
    return (
      <div>
        <TwitterEarnCard
          valid={this.state.valid}
        />
      </div>
    )
  }
}

export default AprilEarn
