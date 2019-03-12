import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_CREATE_COMMENT,
  REQUEST_SHARE_COMMENTS,
  REQUEST_DELETE_COMMENT,
  REQUEST_EDIT_COMMENT,
} from 'actions'

import createComment from './createComment'
import fetchShareComments from './fetchShareComments'
import deleteComment from './deleteComment'
import editComment from './editComment'

export default function* commentSaga() {
  yield [
    takeLatest(REQUEST_SHARE_COMMENTS, fetchShareComments),
    takeLatest(REQUEST_CREATE_COMMENT, createComment),
    takeLatest(REQUEST_DELETE_COMMENT, deleteComment),
    takeLatest(REQUEST_EDIT_COMMENT, editComment)
  ]
}
