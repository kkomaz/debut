import { REQUEST_REMOVE_SHARE_FEEDS } from 'actions'

const requestRemoveShare = (share) => {
  return {
    type: REQUEST_REMOVE_SHARE_FEEDS,
    payload: share,
  }
}

export default requestRemoveShare
