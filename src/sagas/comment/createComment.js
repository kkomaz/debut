import { put, call } from 'redux-saga/effects'
import { CREATE_COMMENT_SUCCESS, CREATE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'
import Share from 'model/share'

const createComment = async (action) => {
  let comments
  const { params } = action
  const comment = new Comment({
    ...params,
    valid: true,
  })
  comment.save()

  const share = await Share.findById(params.share_id)

  if (!share.attrs.comments) {
    comments = [{ ...comment.attrs, _id: comment._id }]
    share.update({
      comments,
      commentCount: 1,
    })

    await share.save()
  } else if (share.attrs.comments && share.attrs.comments.length < 5) {
    comments = share.attrs.comments
    comments.push({ ...comment.attrs, _id: comment._id })
    share.update({
      comments,
      commentCount: share.attrs.commentCount + 1
    })

    await share.save()
  } else if (share.attrs.comments && share.attrs.comments.length === 5) {
    comments = share.attrs.comments
    comments.push({ ...comment.attrs, _id: comment._id })
    comments.shift()
    share.update({
      comments,
      commentCount: share.attrs.commentCount + 1
    })
    await share.save()
  }

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
