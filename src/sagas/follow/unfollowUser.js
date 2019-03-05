import { put, call } from 'redux-saga/effects'
import _ from 'lodash'
import { SET_UNFOLLOW_SUCCESS, SET_UNFOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const unfollowUser = async (action) => {
  const { payload } = action
  const follow = await Follow.findOne({ username: payload.sessionUsername })
  const following = _.filter(payload.following, (followingUser) => followingUser !== payload.username)

  follow.update({
    following,
    followingCount: following.length
  })

  const updatedFollow = follow.save()
  return updatedFollow
}

function* unfollowUserSaga(action) {
  try {
    const follow = yield call(unfollowUser, action)
    const result = follow.attrs ? follow.attrs : follow
    yield put({ type: SET_UNFOLLOW_SUCCESS, payload: result })
  } catch (error) {
    console.log(error.message)
    yield put({ type: SET_UNFOLLOW_FAIL, payload: error.message })
  }
}

export default unfollowUserSaga
