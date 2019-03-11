import { put, call } from 'redux-saga/effects'
import { CREATE_COMMENT_SUCCESS, CREATE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'

const createComment = (action) => {
  const { params } = action
  const comment = new Comment({
    ...params,
    valid: true,
  })
  comment.save()

  // attrs does not contain id so making a new object this way
  return { ...comment.attrs, _id: comment._id }
}

function* createCommentSaga(action) {
  try {
    const comment = yield call(createComment, action)
    yield put({ type: CREATE_COMMENT_SUCCESS, payload: comment })
  } catch (error) {
    yield put({ type: CREATE_COMMENT_FAIL, payload: error.message })
  }
}

export default createCommentSaga
