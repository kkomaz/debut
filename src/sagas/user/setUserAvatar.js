import { put, call } from 'redux-saga/effects'
import { SET_USER_AVATAR_SUCCESS, SET_USER_AVATAR_FAIL } from 'actions'
import DebutUser from 'model/debutUser'
import { User } from 'radiks'

const setUserAvatar = async (action) => {
  const { payload } = action
  const dUser = await DebutUser.findOne({ username: payload.username })
  const user = await User.findOne({ username: payload.username })

  debugger

  user.update({
    profileImgUrl: payload.profileImgUrl
  })

  await user.save()
  const debutUser = await DebutUser.findOne({ username: payload.username })
  const updatedUser = await debutUser.addBasicInfo()
  return updatedUser
}

function* setUserAvatarSaga(action) {
  try {
    const user = yield call(setUserAvatar, action)
    yield put({ type: SET_USER_AVATAR_SUCCESS, payload: user })
  } catch (e) {
    yield put({ type: SET_USER_AVATAR_FAIL, error: e.message })
  }
}

export default setUserAvatarSaga
