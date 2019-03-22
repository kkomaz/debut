import { REQUEST_ADD_SHARE_FEEDS } from 'actions'

const requestAddShareFeeds = (share, hidden = true) => {
  return {
    type: REQUEST_ADD_SHARE_FEEDS,
    payload: share,
    hidden,
  }
}

export default requestAddShareFeeds
