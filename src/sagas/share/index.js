import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_USER_SHARES,
} from 'actions'

import fetchUserShares from './fetchUserShares'

export default function* shareSaga() {
  yield [
    takeLatest(REQUEST_USER_SHARES, fetchUserShares)
  ]
}
