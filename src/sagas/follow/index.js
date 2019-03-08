import { takeLatest, takeEvery } from 'redux-saga/effects'
import {
  REQUEST_FOLLOW,
  REQUEST_FETCH_FOLLOW,
  REQUEST_UNFOLLOW,
} from 'actions'

import followUser from './followUser'
import unfollowUser from './unfollowUser'
import fetchFollow from './fetchFollow'

export default function* shareSaga() {
  yield [
    takeEvery(REQUEST_FETCH_FOLLOW, fetchFollow),
    takeEvery(REQUEST_UNFOLLOW, unfollowUser),
    takeLatest(REQUEST_FOLLOW, followUser),
  ]
}
