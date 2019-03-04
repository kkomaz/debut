import { put, call } from 'redux-saga/effects'
import { SET_USER_AVATAR_SUCCESS, SET_USER_AVATAR_FAIL } from 'actions'
import { User } from 'radiks'

const setUserAvatar = async (action) => {
  const { payload } = action
  const user = await User.findOne({ username: payload.username })

  user.update({
    profileImgUrl: payload.profileImgUrl
  })

  const updatedUser = user.save()
  return updatedUser
}

function* setUserAvatarSaga(action) {
  try {
    const user = yield call(setUserAvatar, action)
    yield put({ type: SET_USER_AVATAR_SUCCESS, payload: user.attrs })
  } catch (e) {
    yield put({ type: SET_USER_AVATAR_FAIL })
  }
}

export default setUserAvatarSaga
