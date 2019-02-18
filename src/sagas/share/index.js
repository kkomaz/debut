import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_USER_SHARES,
  REQUEST_CREATE_SHARE,
} from 'actions'

import fetchUserShares from './fetchUserShares'
import createShare from './createShare'

export default function* shareSaga() {
  yield [
    takeLatest(REQUEST_USER_SHARES, fetchUserShares),
    takeLatest(REQUEST_CREATE_SHARE, createShare)
  ]
}
