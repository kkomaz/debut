import axios from 'axios'
import { put, call } from 'redux-saga/effects'
import {
  FETCH_MENTIONS_SUCCESS,
  FETCH_MENTIONS_FAILURE,
} from 'actions'

const fetchMentions = async (action) => {
  const {
    username,
    limit,
    lt,
  } = action.payload

  const result = await axios.get('/mentions', {
    params: {
      username,
      limit,
      lt,
    }
  })

  return result.data.mentions;
}

function* fetchMentionsSaga(action) {
  try {
    const mentions = yield call(fetchMentions, action)
    yield put({ type: FETCH_MENTIONS_SUCCESS, payload: {
      mentions,
    }})
  } catch (error) {
    yield put({ type: FETCH_MENTIONS_FAILURE, payload: error.message })
  }
}

export default fetchMentionsSaga
