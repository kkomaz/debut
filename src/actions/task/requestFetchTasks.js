import { REQUEST_FETCH_TASKS } from 'actions'

const requestFetchTasks = ({ month, username }) => {
  return {
    type: REQUEST_FETCH_TASKS,
    payload: {
      month,
      username,
    }
  }
}

export default requestFetchTasks
