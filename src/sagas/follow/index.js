import { takeLatest, takeEvery } from 'redux-saga/effects'
import {
  REQUEST_FOLLOW,
  REQUEST_FETCH_FOLLOW,
} from 'actions'

import followUser from './followUser'
import fetchFollow from './fetchFollow'

export default function* shareSaga() {
  yield [
    takeEvery(REQUEST_FETCH_FOLLOW, fetchFollow),
    takeLatest(REQUEST_FOLLOW, followUser),
  ]
}
