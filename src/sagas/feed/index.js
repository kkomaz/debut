import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_FETCH_SHARE_FEEDS,
} from 'actions'

import fetchShareFeeds from './fetchShareFeeds'

export default function* shareSaga() {
  yield [
    takeLatest(REQUEST_FETCH_SHARE_FEEDS, fetchShareFeeds),
  ]
}
