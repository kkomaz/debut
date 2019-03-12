import { put, call } from 'redux-saga/effects'
import { CREATE_COMMENT_SUCCESS, CREATE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'
import Share from 'model/share'

const createComment = async (action) => {
  const { params } = action
  const comment = new Comment({
    ...params,
    valid: true,
  })
  await comment.save()

  const share = await Share.findById(params.share_id)

  if (share.attrs.commentCount) {
    share.update({
      commentCount: share.attrs.commentCount + 1
    })
  } else {
    share.update({
      commentCount: 1
    })
  }

  await share.save()

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
