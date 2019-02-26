import { REQUEST_SET_BASIC_INFO } from 'actions'

const requestSetBasicInformation = (username, type, params, id) => {
  return {
    type: REQUEST_SET_BASIC_INFO,
    payload: {
      username,
      type,
      params,
      id
    }
  }
}

export default requestSetBasicInformation
