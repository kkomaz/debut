import { REQUEST_SET_BASIC_INFO } from 'actions'

const requestSetBasicInformation = (username, params, id) => {
  return {
    type: REQUEST_SET_BASIC_INFO,
    payload: {
      username,
      params,
    }
  }
}

export default requestSetBasicInformation
