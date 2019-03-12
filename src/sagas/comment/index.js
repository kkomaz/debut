import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_CREATE_COMMENT,
  REQUEST_SHARE_COMMENTS,
} from 'actions'

import createComment from './createComment'
import fetchShareComments from './fetchShareComments'

export default function* commentSaga() {
  yield [
    takeLatest(REQUEST_SHARE_COMMENTS, fetchShareComments),
    takeLatest(REQUEST_CREATE_COMMENT, createComment),
  ]
}
