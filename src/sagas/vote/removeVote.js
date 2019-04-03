import { put, call } from 'redux-saga/effects'
import {
  REMOVE_VOTE_SUCCESS,
  REMOVE_VOTE_FAIL,
} from 'actions'
import Vote from 'model/vote'

const removeVote = async (action) => {
  const { vote, detailObj, type } = action.payload
  const voter = await Vote.findOne({ _id: vote._id })
  let result

  try {
    result = await voter.destroy()
  } catch (e) {
    console.log(e.message)
  }

  if (result) {
    if (type === 'share') {
      return {
        vote,
        share: detailObj,
        type,
      }
    }
  }
}

function* removeVoteSaga(action) {
  try {
    const vote = yield call(removeVote, action)
    yield put({ type: REMOVE_VOTE_SUCCESS, payload: vote })
  } catch (error) {
    yield put({ type: REMOVE_VOTE_FAIL, payload: action.payload.detailObj._id })
  }
}

export default removeVoteSaga
