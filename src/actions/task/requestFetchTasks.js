import { REQUEST_FETCH_TASKS } from 'actions'

const requestFetchTasks = (month) => {
  return {
    type: REQUEST_FETCH_TASKS,
    payload: {
      month
    }
  }
}

export default requestFetchTasks
