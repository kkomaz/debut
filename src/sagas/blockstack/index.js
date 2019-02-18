import { takeLatest, takeEvery } from 'redux-saga/effects'
import {
  REQUEST_BLOCKSTACK_DAPPS,
  REQUEST_PROFILE_SEARCH,
  REQUEST_USER_INTRO,
} from 'actions'

import fetchBlockstackDapps from './fetchBlockstackDapps'
import fetchProfileSearch from './fetchProfileSearch'
import fetchUserIntro from './fetchUserIntro'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_BLOCKSTACK_DAPPS, fetchBlockstackDapps),
    takeLatest(REQUEST_PROFILE_SEARCH, fetchProfileSearch),
    takeEvery(REQUEST_USER_INTRO, fetchUserIntro)
  ]
}
