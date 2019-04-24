/** @jsx jsx */

import { jsx, css } from '@emotion/core'
import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Table,
} from 'components/bulma'
import Task from 'model/task'
import moment from 'moment'

class SubmissionHistory extends Component {
  state = {
    tasks: []
  }

  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  componentDidMount = async () => {
    const { username } = this.props
    const result = await Task.fetchList({
      username
    })

    const tasks = _.map(result, 'attrs')

    return this.setState({ tasks })
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
                <tr>
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
                    Pending
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
