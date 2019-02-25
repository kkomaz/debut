import { REQUEST_DELETE_SHARE } from 'actions'

const requestDeleteShare = (share) => {
  return { type: REQUEST_DELETE_SHARE, payload: share }
}

export default requestDeleteShare
