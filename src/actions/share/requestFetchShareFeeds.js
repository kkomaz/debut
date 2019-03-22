import { REQUEST_FETCH_SHARE_FEEDS } from 'actions'

const requestFetchShareFeeds = ({ follow, offset }) => {
  return {
    type: REQUEST_FETCH_SHARE_FEEDS,
    payload: {
      follow,
      offset,
    }
  }
}

export default requestFetchShareFeeds
