import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_BLOCKSTACK_DAPPS,
  REQUEST_PROFILE_SEARCH,
} from 'actions'

import fetchBlockstackDapps from './fetchBlockstackDapps'
import fetchProfileSearch from './fetchProfileSearch'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_BLOCKSTACK_DAPPS, fetchBlockstackDapps),
    takeLatest(REQUEST_PROFILE_SEARCH, fetchProfileSearch),
  ]
}
