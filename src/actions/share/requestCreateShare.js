import { REQUEST_CREATE_SHARE } from 'actions'

const requestCreateShare = (username, params) => {
  return { type: REQUEST_CREATE_SHARE, payload: {
    username,
    params,
  }}
}

export default requestCreateShare
