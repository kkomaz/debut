import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_CREATE_COMMENT,
} from 'actions'

import createComment from './createComment'

export default function* commentSaga() {
  yield [
    takeLatest(REQUEST_CREATE_COMMENT, createComment),
  ]
}
