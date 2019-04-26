import { REQUEST_DELETE_TASK } from 'actions'

const requestDeleteTask = (taskId) => {
  return {
    type: REQUEST_DELETE_TASK,
    payload: taskId
  }
}

export default requestDeleteTask
