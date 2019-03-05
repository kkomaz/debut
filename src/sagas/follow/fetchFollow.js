import { put, call } from 'redux-saga/effects'
import { FETCH_FOLLOW_SUCCESS, FETCH_FOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const fetchFollow = (action) => {
  return Follow.findOne({
    username: action.payload.username,
  })
}

function* fetchFollowSaga(action) {
  try {
    const follow = yield call(fetchFollow, action)
    yield put({ type: FETCH_FOLLOW_SUCCESS, payload: follow.attrs || {} })
  } catch (error) {
    yield put({ type: FETCH_FOLLOW_FAIL, payload: error.message })
  }
}

export default fetchFollowSaga
