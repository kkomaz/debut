import { put, call } from 'redux-saga/effects'
import { DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'
import Share from 'model/share'

const deleteComment = async (action) => {
  const { comment, share } = action.payload

  const deletedComment = await Comment.findById(comment._id)
  const currentShare = await Share.findById(share._id)

  console.log(deletedComment)
  console.log(currentShare)
  // deletedComment.update({
  //   text: '',
  //   imageFile: '',
  //   valid: false
  // })
  // return deletedComment.save()
}

function* deleteCommentSaga(action) {
  try {
    const comment = yield call(deleteComment, action)
    yield put({ type: DELETE_COMMENT_SUCCESS, payload: comment.attrs })
  } catch (error) {
    console.log(error.message)
    yield put({ type: DELETE_COMMENT_FAIL, payload: error.message })
  }
}

export default deleteCommentSaga
