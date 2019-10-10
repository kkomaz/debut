import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_ADD_CONTACTS_TO_FOLLOW,
} from 'actions'

import addContactsToFollow from './addContactsToFollow'

export default function* contactsSaga() {
  yield [
    takeLatest(REQUEST_ADD_CONTACTS_TO_FOLLOW, addContactsToFollow),
  ]
}
