/** @jsx jsx */

// Library Imports
import { css, jsx } from '@emotion/core'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

// Action Imports
import { requestFetchTasks } from 'actions/task'

// Component Imports
import TwitterEarnCard from './TwitterEarnCard'
import { BarLoader } from 'components/Loader'
import { Heading } from 'components/bulma'

// Util Imports
import { linkifyText } from 'utils/decorator'

class MayEarn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      valid: props.currentMonth === 4
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
      month: 4
    })
  }

  render() {
    const {
      currentMonth,
      loading,
      sessionUser,
      twitterTask,
    } = this.props

    return (
      <div>
        {
          currentMonth !== 4 &&
          <Heading
            size={6}
            css={css`
              text-align: center;
              `}
              >
              Task will be available May 1st, 2019
            </Heading>
        }

        <Heading
          size={6}
          css={css`
            text-align: center;
          `}
        >
          June App Mining Result - Currently Unavailable
        </Heading>
        <Heading
          size={6}
          css={css`
            text-align: center;
          `}
        >
          Check here for most recent results {linkifyText('https://app.co/mining')}
        </Heading>
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
  const tasks = _.filter(state.task.list, (task) => task.month === 4)
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
})(MayEarn)
