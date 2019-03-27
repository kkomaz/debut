import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_ADD_VOTE,
  REQUEST_REMOVE_VOTE,
} from 'actions'

import addVote from './addVote'
import removeVote from './removeVote'

export default function* voteSaga() {
  yield [
    takeLatest(REQUEST_ADD_VOTE, addVote),
    takeLatest(REQUEST_REMOVE_VOTE, removeVote)
  ]
}
