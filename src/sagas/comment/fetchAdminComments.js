import axios from 'axios'
import { put, call } from 'redux-saga/effects'
import {
  FETCH_ADMIN_COMMENTS_SUCCESS,
  FETCH_ADMIN_COMMENTS_FAIL,
} from 'actions'

const fetchAdminComments = async (action) => {
  const {
    parent_creator,
    limit,
    lt,
  } = action.payload

  const result = await axios.get('/comments', {
    params: {
      parent_creator,
      limit,
      lt,
    }
  })

  return result.data.comments;
}

function* fetchAdminCommentsSaga(action) {
  try {
    const comments = yield call(fetchAdminComments, action)
    yield put({ type: FETCH_ADMIN_COMMENTS_SUCCESS, payload: {
      comments,
    }})
  } catch (error) {
    yield put({ type: FETCH_ADMIN_COMMENTS_FAIL, payload: error.message })
  }
}

export default fetchAdminCommentsSaga
