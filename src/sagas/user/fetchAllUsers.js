import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_ALL_USERS_SUCCESS, FETCH_ALL_USERS_FAIL } from 'actions'
import DebutUser from 'model/debutUser'

const fetchAllUsers = (action) => {
  return DebutUser.fetchList()
}

function* fetchAllUsersSaga(action) {
  try {
    const radiksUsers = yield call(fetchAllUsers, action);

    const users = _.map(radiksUsers, (user) => {
      return user.data
    })

    yield put({ type: FETCH_ALL_USERS_SUCCESS, payload: users });
  } catch (error) {
    yield put({ type: FETCH_ALL_USERS_FAIL });
  }
}

export default fetchAllUsersSaga
