import axios from 'axios'
import { put, call } from 'redux-saga/effects'
// import { FETCH_ALL_USERS_SUCCESS, FETCH_ALL_USERS_FAIL } from 'actions'

const fetchAllUsers = (action) => {
  return axios.get('https://debut-3fcee.firebaseio.com/users.json')
}

function* fetchAllUsersSaga(action) {
  try {
    const { data } = yield call(fetchAllUsers, action);
    const users = []

    for (const key in data) {
      users.push({ ...data[key], id: key })
    }

    yield put({ type: 'FETCH_ALL_USERS_SUCCESS', payload: users });
  } catch (error) {
    yield put({ type: 'FETCH_ALL_USERS_FAIL' });
  }
}

export default fetchAllUsersSaga
