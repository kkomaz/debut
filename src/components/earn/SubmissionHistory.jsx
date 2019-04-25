/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Button,
  Table,
} from 'components/bulma'
import Task from 'model/task'
import Submission from 'model/submission'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'

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
              <abbr title="Blockstack ID">Blockstack ID</abbr>
            </th>
            <th>
              <abbr title="Task">Task</abbr>
            </th>
            <th>
              <abbr title="Completed At">Completed At</abbr>
            </th>
            <th>
              <abbr title="Link">Link</abbr>
            </th>
            <th>
              <abbr title="Parent Username">Parent Username</abbr>
            </th>
            <th>
              <abbr title="Status">Status</abbr>
            </th>
            <th>
              <abbr title="Actions">Actions</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.state.tasks, (task) => {
              return (
                <tr key={task._id}>
                  <td>
                    {task.username}
                  </td>
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
                      {linkifyText(task.link)}
                    </td>
                    <td>
                      {task.parent_username}
                    </td>
                    <td>
                      {this.renderStatus(task)}
                    </td>
                    <td>
                      <Button onClick={() => this.edit(task)} color="primary" css={css`margin-right: 5px;`}>
                        Edit
                      </Button>
                      <Button onClick={() => this.delete(task)} color="danger">
                        Delete
                      </Button>
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
