import {
  REQUEST_ALL_USERS,
  REQUEST_PAGINATED_USERS,
  REQUEST_SINGLE_USER,
  REQUEST_SET_BASIC_INFO,
} from 'actions'
import { takeLatest } from 'redux-saga/effects'

import fetchAllUsers from './fetchAllUsers'
import fetchPaginatedUsers from './fetchPaginatedUsers'
import fetchSingleUser from './fetchSingleUser'
import setBasicInformation from './setBasicInformation'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_ALL_USERS, fetchAllUsers),
    takeLatest(REQUEST_PAGINATED_USERS, fetchPaginatedUsers),
    takeLatest(REQUEST_SINGLE_USER, fetchSingleUser),
    takeLatest(REQUEST_SET_BASIC_INFO, setBasicInformation)
  ]
}
