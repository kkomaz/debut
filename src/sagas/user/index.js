import {
  REQUEST_ALL_USERS,
  REQUEST_PAGINATED_USERS,
  REQUEST_SINGLE_USER,
  REQUEST_SET_BASIC_INFO,
  REQUEST_SET_USER_AVATAR,
} from 'actions'
import { takeLatest } from 'redux-saga/effects'

import fetchAllUsers from './fetchAllUsers'
import fetchPaginatedUsers from './fetchPaginatedUsers'
import fetchSingleUser from './fetchSingleUser'
import setBasicInformation from './setBasicInformation'
import setUserAvatarSaga from './setUserAvatar'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_ALL_USERS, fetchAllUsers),
    takeLatest(REQUEST_PAGINATED_USERS, fetchPaginatedUsers),
    takeLatest(REQUEST_SET_BASIC_INFO, setBasicInformation),
    takeLatest(REQUEST_SET_USER_AVATAR, setUserAvatarSaga),
    takeLatest(REQUEST_SINGLE_USER, fetchSingleUser),
  ]
}
