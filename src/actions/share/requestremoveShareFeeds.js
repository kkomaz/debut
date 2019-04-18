import { REQUEST_REMOVE_SHARE_FEEDS } from 'actions'

const requestRemoveShareFeeds = (share) => {
  return {
    type: REQUEST_REMOVE_SHARE_FEEDS,
    payload: share,
  }
}

export default requestRemoveShareFeeds
