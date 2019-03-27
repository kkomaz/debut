import { REQUEST_FETCH_SHARE_FEEDS } from 'actions'

const requestFetchShareFeeds = ({ follow, lt }) => {
  return {
    type: REQUEST_FETCH_SHARE_FEEDS,
    payload: {
      follow,
      lt,
    }
  }
}

export default requestFetchShareFeeds
