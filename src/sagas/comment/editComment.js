import { put, call } from 'redux-saga/effects'
import { EDIT_COMMENT_SUCCESS, EDIT_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'

const editComment = async (action) => {
  const { id, params } = action.payload

  const comment = await Comment.findById(id)

  comment.update(params)

  await comment.save()

  return { ...comment.attrs, _id: comment._id }
}

function* editCommentSaga(action) {
  try {
    const comment = yield call(editComment, action)
    yield put({ type: EDIT_COMMENT_SUCCESS, payload: comment })
  } catch (error) {
    console.log(error.message)
    yield put({ type: EDIT_COMMENT_FAIL, payload: error.message })
  }
}

export default editCommentSaga
