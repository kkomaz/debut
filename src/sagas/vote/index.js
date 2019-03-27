import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_ADD_VOTE,
} from 'actions'

import addVote from './addVote'

export default function* voteSaga() {
  yield [
    takeLatest(REQUEST_ADD_VOTE, addVote),
  ]
}
