import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import {
  FETCH_ADMIN_COMMENTS_SUCCESS,
  FETCH_ADMIN_COMMENTS_FAIL,
} from 'actions'
import Comment from 'model/comment'

const fetchAdminComments = (action) => {
  const {
    parent_creator,
    limit,
    lt,
  } = action.payload

  return Comment.fetchList({
    parent_creator,
    limit,
    lt,
  })
}

function* fetchAdminCommentsSaga(action) {
  try {
    const comments = yield call(fetchAdminComments, action)
    yield put({ type: FETCH_ADMIN_COMMENTS_SUCCESS, payload: comments })
  } catch (error) {
    yield put({ type: FETCH_ADMIN_COMMENTS_FAIL, payload: error.message })
  }
}

export default fetchAdminCommentsSaga
