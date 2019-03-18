import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_SHARE_FEEDS_SUCCESS, FETCH_SHARE_FEEDS_FAIL } from 'actions'
import Share from 'model/share'

const fetchShareFeeds = async (action) => {
  const { payload } = action

  const shares = await Share.fetchList({
    username: payload.following,
    sort: '-createdAt',
    limit: 5,
    offset: action.payload.offset,
    valid: true,
  })

  return shares
}

function* fetchShareFeedsSaga(action) {
  try {
    const radiksShares = yield call(fetchShareFeeds, action)

    const shares = _.map(radiksShares, 'attrs')
    yield put({ type: FETCH_SHARE_FEEDS_SUCCESS, payload: shares })
  } catch (error) {
    yield put({ type: FETCH_SHARE_FEEDS_FAIL, payload: error.message })
  }
}

export default fetchShareFeedsSaga
