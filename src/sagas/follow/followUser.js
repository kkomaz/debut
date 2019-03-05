import { put, call } from 'redux-saga/effects'
import { SET_FOLLOW_SUCCESS, SET_FOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const followUser = async (action) => {
  const { payload } = action
  const follow = await Follow.findOne({ username: payload.sessionUsername })

  if (!follow) {
    const createdFollow = new Follow({
      username: payload.sessionUsername,
      following: [payload.username],
      followers: [],
      followingCount: 1,
      followerCount: 0
    })
    createdFollow.save()
    return { ...createdFollow.attrs, _id: createdFollow._id }
  }

  const following = [...payload.following, payload.userame]
  follow.update({
    following,
    followingCount: following.length
  })
  const updatedFollow = follow.save()
  return updatedFollow.attrs
}

function* followUserSaga(action) {
  try {
    const follow = yield call(followUser, action)
    yield put({ type: SET_FOLLOW_SUCCESS, payload: follow })
  } catch (error) {
    yield put({ type: SET_FOLLOW_FAIL, payload: error.message })
  }
}

export default followUserSaga
