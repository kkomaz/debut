import { put, call } from 'redux-saga/effects'
import { REMOVE_VOTE_SUCCESS, REMOVE_VOTE_FAIL } from 'actions'
import Vote from 'model/vote'

const addVote = async (action) => {
  const { voteId } = action
  const vote = await Vote.findOne({ _id: voteId })
  let result

  try {
    result = await vote.destroy()
  } catch (e) {
    console.log(e.message)
  }

  if (result.success) {
    return voteId
  }
}

function* addVoteSaga(action) {
  try {
    const voteId = yield call(addVote, action)
    yield put({ type: REMOVE_VOTE_SUCCESS, payload: voteId })
  } catch (error) {
    yield put({ type: REMOVE_VOTE_FAIL, payload: error.message })
  }
}

export default addVoteSaga
