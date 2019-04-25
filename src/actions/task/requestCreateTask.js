import { REQUEST_CREATE_TASK } from 'actions'

const requestCreateTask = (params) => {
  return {
    type: REQUEST_CREATE_TASK,
    payload: params
  }
}

export default requestCreateTask
