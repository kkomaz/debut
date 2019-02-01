import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_BLOCKSTACK_APPS,
  REQUEST_PROFILE_SEARCH,
} from 'actions'

import fetchBlockstackApps from './fetchBlockstackApps'
import fetchProfileSearch from './fetchProfileSearch'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_BLOCKSTACK_APPS, fetchBlockstackApps),
    takeLatest(REQUEST_PROFILE_SEARCH, fetchProfileSearch)
  ]
}
