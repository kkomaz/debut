import { REQUEST_BLOCKSTACK_APPS } from 'actions'
import { takeLatest } from 'redux-saga/effects'
import fetchBlockstackApps from './fetchBlockstackApps'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_BLOCKSTACK_APPS, fetchBlockstackApps)
  ]
}
