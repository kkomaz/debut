import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_ALL_USERS_SUCCESS, FETCH_ALL_USERS_FAIL } from 'actions'
import { User } from 'radiks'

const fetchAllUsers = (action) => {
  return User.fetchList()
}

function* fetchAllUsersSaga(action) {
  try {
    const radiksUsers = yield call(fetchAllUsers, action);

    const users = _.map(radiksUsers, (user) => {
      return user.attrs
    })

    yield put({ type: FETCH_ALL_USERS_SUCCESS, payload: users });
  } catch (error) {
    console.log(error.message)
    yield put({ type: FETCH_ALL_USERS_FAIL });
  }
}

export default fetchAllUsersSaga
