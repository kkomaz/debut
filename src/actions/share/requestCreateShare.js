import { REQUEST_CREATE_SHARE } from 'actions'

const requestCreateShare = (params) => {
  return { type: REQUEST_CREATE_SHARE, params }
}

export default requestCreateShare
