import { REQUEST_ALL_USERS, REQUEST_PAGINATED_USERS } from 'actions'
import { takeLatest } from 'redux-saga/effects'

import fetchAllUsers from './fetchAllUsers'
import fetchPaginatedUsers from './fetchPaginatedUsers'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_ALL_USERS, fetchAllUsers),
    takeLatest(REQUEST_PAGINATED_USERS, fetchPaginatedUsers)
  ]
}
