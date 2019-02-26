import { REQUEST_SINGLE_USER } from 'actions'

const requestSingleUser = (username) => {
  return {
    type: REQUEST_SINGLE_USER,
    payload: {
      username,
    }
  }
}

export default requestSingleUser
