import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_SHARE_COMMENTS_SUCCESS, FETCH_SHARE_COMMENTS_FAIL } from 'actions'
import Comment from 'model/comment'

const fetchShareComments = (action) => {
  return Comment.fetchList({
    share_id: action.payload.share_id,
    sort: '-createdAt',
    limit: 5,
    offset: action.payload.offset,
    valid: true,
  })
}

function* fetchShareCommentsSaga(action) {
  try {
    const radiksComments = yield call(fetchShareComments, action)

    const comments = _.map(radiksComments, (comment) => {
      return comment.attrs
    })

    yield put({ type: FETCH_SHARE_COMMENTS_SUCCESS, payload: {
      share_id: action.payload.share_id,
      comments: _.reverse(comments)
    }})
  } catch (error) {
    yield put({ type: FETCH_SHARE_COMMENTS_FAIL, payload: error.message })
  }
}

export default fetchShareCommentsSaga
