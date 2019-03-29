import { put, call } from 'redux-saga/effects'
import { FETCH_SHARE_FEEDS_SUCCESS, FETCH_SHARE_FEEDS_FAIL } from 'actions'
import axios from 'axios'

const fetchShareFeeds = async (action) => {
  const { follow, lt } = action.payload

  const { data } = await axios.get('/shares', {
    params: {
      username: [...follow.following, follow.username],
      limit: 5,
      lt,
    }
  })

  const shares = data.shares

  return shares
}

function* fetchShareFeedsSaga(action) {
  try {
    const shares = yield call(fetchShareFeeds, action)
    yield put({ type: FETCH_SHARE_FEEDS_SUCCESS, payload: shares })
  } catch (error) {
    yield put({ type: FETCH_SHARE_FEEDS_FAIL, payload: error.message })
  }
}

export default fetchShareFeedsSaga
