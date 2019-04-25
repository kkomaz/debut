/** @jsx jsx */

import { jsx, css } from '@emotion/core'
import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Table,
} from 'components/bulma'
import Task from 'model/task'
import Submission from 'model/submission'
import moment from 'moment'

class SubmissionHistory extends Component {
  state = {
    tasks: [],
    submissions: {},
    error: undefined,
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  componentDidMount = async () => {
    const { username } = this.props
    let tasks
    let submissions = {}
    let error

    try {
      const result = await Task.fetchList({
        username
      })
      tasks = _.map(result, 'attrs')
    } catch (e) {
      error = [...this.state.error, { message: 'Task Fetch failed' }]
    }

    try {
      const result = await Submission.fetchList({
        username
      })
      const submissionsArray = _.map(result, 'attrs')

      if (submissionsArray.length > 0) {
        _.each(submissionsArray, (s) => {
          submissions[s.task_id] = s
        })
      }
    } catch (e) {
      error = [...this.state.error, { message: 'Submission Fetch failed' }]
    }

    return this.setState({
      tasks,
      submissions,
      error,
    })
  }

  renderStatus = (task) => {
    const { submissions } = this.state

    if (!submissions[task._id]) {
      return 'Pending'
    }

    if (submissions[task._id].approved) {
      return 'Approved'
    }

    return 'Rejected'
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <abbr title="Task">Task</abbr>
            </th>
            <th>
              <abbr title="Completed At">Completed At</abbr>
            </th>
            <th>
              <abbr title="Status">Status</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.state.tasks, (task) => {
              return (
                <tr key={task._id}>
                  <td
                    css={css`
                      text-transform: capitalize;
                    `}
                  >
                    {task.type}
                  </td>
                  <td>
                    {moment(task.createdAt).utc().format("MMM DD YYYY")}
                  </td>
                  <td>
                    {this.renderStatus(task)}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    )
  }
}

export default SubmissionHistory
