import { put, call } from 'redux-saga/effects'
import {
  SET_BASIC_INFO_SUCCESS,
  SET_BASIC_INFO_FAIL,
} from 'actions'
import { User } from 'radiks'

const setBasicInformation = async (action) => {
  const { params, username } = action.payload

  const user = await User.findOne({ username })
  user.update(params)
  await user.save()

  return user.attrs
}

function* setBasicInformationSaga(action) {
  try {
    const user = yield call(setBasicInformation, action)
    yield put({ type: SET_BASIC_INFO_SUCCESS, payload: {
      user,
      username: action.payload.username,
    }})
  } catch (error) {
    yield put({ type: SET_BASIC_INFO_FAIL })
  }
}


export default setBasicInformationSaga
