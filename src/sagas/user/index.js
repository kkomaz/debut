import { REQUEST_ALL_USERS } from 'actions'
import { takeLatest } from 'redux-saga/effects'
import fetchAllUsers from './fetchAllUsers'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_ALL_USERS, fetchAllUsers)
  ]
}
