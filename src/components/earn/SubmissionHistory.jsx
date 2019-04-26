/** @jsx jsx */

// Library Imports
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

// Utils Imports
import { linkifyText } from 'utils/decorator'
import Task from 'model/task'
import Submission from 'model/submission'

// Component Imports
import {
  Button,
  Heading,
  Modal,
  Section,
  Table,
} from 'components/bulma'

// Action Imports
import {
  requestDeleteTask,
  requestFetchTasks,
} from 'actions/task'

class SubmissionHistory extends Component {
  state = {
    submissions: {},
    error: undefined,
    showModal: false,
    currentTask: {},
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
    currentMonth: PropTypes.number.isRequired,
    tasks: PropTypes.array.isRequired,
  }

  componentDidMount = async () => {
    const { username } = this.props
    let submissions = {}
    let error

    this.props.requestFetchTasks({ username })

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

  closeModal = () => {
    this.setState({ showModal: false })
  }

  openModal = (task) => {
    this.setState({
      showModal: true,
      currentTask: task,
    })
  }

  deleteTask = (task) => {
    this.props.requestDeleteTask(task._id)
  }

  render() {
    const { showModal } = this.state
    const { currentMonth } = this.props

    return (
      <React.Fragment>
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
                <abbr title="BTC Address">BTC Address</abbr>
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
              _.map(this.props.tasks, (task) => {
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
                        {task.btc_address}
                      </td>
                      <td>
                        {this.renderStatus(task)}
                      </td>
                      <td>
                        <Button
                          onClick={() => this.deleteTask(task)}
                          color="danger"
                          disabled={task.month !== currentMonth}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
          <Modal
            show={showModal}
            onClose={this.closeModal}
            closeOnEsc
          >
            <Modal.Content>
              <Section
                css={css`
                  align-items: center;
                  background-color: white;
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                `}
              >
                <Heading size={6}>
                  Are you sure you want to delete this task?
                </Heading>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <Button
                    css={css`
                      margin-right: 10px;
                    `}
                    onClick={this.closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.deleteTask}
                    color="danger"
                  >
                    Confirm
                  </Button>
                </div>
              </Section>
            </Modal.Content>
          </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.task.list,
  }
}

export default connect(mapStateToProps, {
  requestDeleteTask,
  requestFetchTasks,
})(SubmissionHistory)
