import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_USER_SHARES,
  REQUEST_CREATE_SHARE,
  REQUEST_EDIT_SHARE,
  REQUEST_DELETE_SHARE,
} from 'actions'

import fetchUserShares from './fetchUserShares'
import createShare from './createShare'
import editShare from './editShare'
import deleteShare from './deleteShare'

export default function* shareSaga() {
  yield [
    takeLatest(REQUEST_USER_SHARES, fetchUserShares),
    takeLatest(REQUEST_CREATE_SHARE, createShare),
    takeLatest(REQUEST_EDIT_SHARE, editShare),
    takeLatest(REQUEST_DELETE_SHARE, deleteShare)
  ]
}
