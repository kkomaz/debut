import { put, call } from 'redux-saga/effects'
import { SET_FOLLOW_SUCCESS, SET_FOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const followUser = async (action) => {
  const { payload } = action
  const follow = await Follow.findOne({ username: payload.username })
  const following = [...payload.followers, payload.userame]

  follow.update({
    following,
    followingCount: following.length
  })
  return follow.save()
}

function* followUserSaga(action) {
  try {
    const follow = yield call(followUser, action)
    yield put({ type: SET_FOLLOW_SUCCESS, payload: follow.attrs })
  } catch (error) {
    yield put({ type: SET_FOLLOW_FAIL, payload: error.message })
  }
}

export default followUserSaga
