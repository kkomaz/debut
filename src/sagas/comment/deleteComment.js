import { put, call } from 'redux-saga/effects'
import { DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'
import Share from 'model/share'
import Mention from 'model/mention'

const deleteComment = async (action) => {
  const { comment, share } = action.payload

  const deletedComment = await Comment.findById(comment._id)
  const currentShare = await Share.findById(share._id)

  deletedComment.update({
    text: '',
    imageFile: '',
    valid: false
  })

  currentShare.update({
    commentCount: currentShare.attrs.commentCount - 1
  })

  await currentShare.save()
  await deletedComment.save()

  const mentions = await Mention.fetchList({ parent_id: comment._id })

  if (mentions.length > 0) {
    for (let i = 0; i < mentions.length; i++) {
      await mentions[i].destroy()
    }
  }

  return { ...deletedComment.attrs, _id: deletedComment._id }
}

function* deleteCommentSaga(action) {
  try {
    const comment = yield call(deleteComment, action)
    yield put({ type: DELETE_COMMENT_SUCCESS, payload: comment })
  } catch (error) {
    console.log(error.message)
    yield put({ type: DELETE_COMMENT_FAIL, payload: error.message })
  }
}

export default deleteCommentSaga
