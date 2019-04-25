/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Input, Container } from 'components/bulma'
import Task from 'model/task'
import Submission from 'model/submission'
import moment from 'moment'
import { linkifyText } from 'utils/decorator'
import { UserContext } from 'components/User/UserProvider'
import { withRouter } from 'react-router-dom'

class SubmissionHistory extends Component {
  state = {
    tasks: [],
    submissions: {},
    error: undefined,
    selectedMonth: moment().month(),
  }

  componentDidMount() {
    const { sessionUser } = this.context.state
    const { history } = this.props

    if (sessionUser.username !== 'kkomaz.id') {
      history.push('/')
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  fetchTasks = async () => {
    let tasks
    let submissions = {}
    let error

    try {
      const result = await Task.fetchList({
        month: this.state.selectedMonth,
      })
      tasks = _.map(result, 'attrs')
    } catch (e) {
      error = [...this.state.error, { message: 'Task Fetch failed' }]
    }

    try {
      const result = await Submission.fetchList({
        month: this.state.selectedMonth,
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

  approve = async (task) => {
    const { submissions } = this.state
    if (submissions[task._id]) {
      const submission = await Submission.findOne({ task_id: task._id })
      submission.update({
        approved: true
      })
      await submission.save()
      const result = { ...submission.attrs, _id: submission._id }

      this.setState({
        submissions: {
          ...this.state.submissions, [task._id]: result
        }
      })
    } else {
      const submission = new Submission({
        task_id: task._id,
        username: task.username,
        approved: true,
        month: task.month,
      })
      await submission.save()
      const result = { ...submission.attrs, _id: submission._id }

      this.setState({
        submissions: {
          ...this.state.submissions, [task._id]: result
        }
      })
    }
  }

  reject = async (task) => {
    const { submissions } = this.state

    if (submissions[task._id]) {
      const submission = await Submission.findOne({ task_id: task._id })
      submission.update({
        approved: false
      })
      await submission.save()
      const result = { ...submission.attrs, _id: submission._id }

      this.setState({
        submissions: {
          ...this.state.submissions, [task._id]: result
        }
      })
    } else {
      const submission = new Submission({
        task_id: task._id,
        username: task.username,
        approved: false,
        month: task.month,
      })
      await submission.save()
      const result = { ...submission.attrs, _id: submission._id }

      this.setState({
        submissions: {
          ...this.state.submissions, [task._id]: result
        }
      })
    }
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
    console.log(this.state.submissions)
    return (
      <Container>
        <Input
          css={css`
            font-size: 14px;
          `}
          name="selectedMonth"
          onChange={this.onChange}
          value={this.state.selectedMonth}
        />
        <Button onClick={this.fetchTasks}>
          Fetch List
        </Button>
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
                        <Button onClick={() => this.approve(task)} color="primary" css={css`margin-right: 5px;`}>
                          Approve
                        </Button>
                        <Button onClick={() => this.reject(task)} color="danger">
                          Reject
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
      </Container>
    )
  }
}

SubmissionHistory.contextType = UserContext
export default withRouter(SubmissionHistory)
