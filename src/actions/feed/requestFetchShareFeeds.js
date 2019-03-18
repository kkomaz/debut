import { REQUEST_FETCH_SHARE_FEEDS } from 'actions'

const requestFetchShareFeeds = (userFollow) => {
  return {
    type: REQUEST_FETCH_SHARE_FEEDS,
    payload: userFollow
  }
}

export default requestFetchShareFeeds
