// Library Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

// Action Imports
import { requestFetchTasks } from 'actions/task'

// Component Imports
import TwitterEarnCard from './TwitterEarnCard'
import { BarLoader } from 'components/Loader'

class AprilEarn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      valid: props.currentMonth === 3
    }
  }

  static propTypes = {
    currentMonth: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    sessionUser: PropTypes.object.isRequired,
    twitterTask: PropTypes.object,
  }

  componentDidMount() {
    const { sessionUser } = this.props

    this.props.requestFetchTasks({
      username: sessionUser.username,
      month: 3
    })
  }

  render() {
    const { sessionUser, twitterTask, loading } = this.props

    return (
      <div>
        {
          loading ? <BarLoader /> :
          <TwitterEarnCard
            valid={this.state.valid}
            sessionUser={sessionUser}
            task={twitterTask}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const tasks = _.filter(state.task.list, (task) => task.month === 3)
  const loading = state.task.loading

  const twitterTask = _.find(tasks, (task) =>
    task.type === 'twitter' && task.username === ownProps.sessionUser.username
  )

  return {
    loading,
    twitterTask,
  }
}

export default connect(mapStateToProps, {
  requestFetchTasks,
})(AprilEarn)
