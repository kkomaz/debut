import { put, call } from 'redux-saga/effects'
import {
  ADD_VOTE_SUCCESS,
  ADD_VOTE_FAIL
} from 'actions'
import Vote from 'model/vote'

const addVote = async (action) => {
  const { username, detailObj, type } = action.payload
  let vote

  if (type === 'share') {
    vote = new Vote({
      username,
      share_id: detailObj._id,
    })
    await vote.save()
    // attrs does not contain id so making a new object  this way
    const voteResult = { ...vote.attrs, _id: vote._id }

    return {
      vote: voteResult,
      share_id: detailObj._id
    }
  }
}

function* addVoteSaga(action) {
  try {
    const vote = yield call(addVote, action)
    yield put({ type: ADD_VOTE_SUCCESS, payload: vote })
  } catch (error) {
    yield put({ type: ADD_VOTE_FAIL, payload: action.payload.detailObj._id })
  }
}

export default addVoteSaga
