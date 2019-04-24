import { REQUEST_TASK_CREATE_TWITTER } from 'actions'

const requestTaskCreateTwitter = (params) => {
  return {
    type: REQUEST_TASK_CREATE_TWITTER,
    payload: params
  }
}

export default requestTaskCreateTwitter
