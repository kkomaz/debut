import { REQUEST_ADD_SHARE_FEEDS } from 'actions'

const requestAddShareFeeds = (share) => {
  return {
    type: REQUEST_ADD_SHARE_FEEDS,
    payload: share
  }
}

export default requestAddShareFeeds
