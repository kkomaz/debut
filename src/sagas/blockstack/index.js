import { takeLatest, takeEvery } from 'redux-saga/effects'
import {
  REQUEST_BLOCKSTACK_APPS,
  REQUEST_PROFILE_SEARCH,
  REQUEST_USER_INTRO,
} from 'actions'

import fetchBlockstackApps from './fetchBlockstackApps'
import fetchProfileSearch from './fetchProfileSearch'
import fetchUserIntro from './fetchUserIntro'

export default function* userSaga() {
  yield [
    takeLatest(REQUEST_BLOCKSTACK_APPS, fetchBlockstackApps),
    takeLatest(REQUEST_PROFILE_SEARCH, fetchProfileSearch),
    takeEvery(REQUEST_USER_INTRO, fetchUserIntro)
  ]
}
