import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_MENTIONS,
} from 'actions'

import fetchMentions from './fetchMentions'

export default function* mentionSaga() {
  yield [
    takeLatest(REQUEST_MENTIONS, fetchMentions),
  ]
}
