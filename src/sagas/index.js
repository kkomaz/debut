import { REQUEST_ALL_USERS } from 'actions'
import { takeEvery } from 'redux-saga/effects'
import fetchAllUsers from './user/fetchAllUsers'

export default function* rootSaga() {
  yield takeEvery(REQUEST_ALL_USERS, fetchAllUsers)
}
