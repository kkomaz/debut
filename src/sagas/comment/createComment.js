import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { CREATE_COMMENT_SUCCESS, CREATE_COMMENT_FAIL } from 'actions'
import Comment from 'model/comment'
import Share from 'model/share'
import Mention from 'model/mention'
import checkMentions from 'utils/mentions/checkMentions'

const createComment = async (action) => {
  let mentions = []
  let comment
  const { params, username } = action.payload

  /**
   * Don't make this async await because don't want to wait for this
  */
  const mention = [...new Set(checkMentions(params.text))]
  const filteredMentions = _.filter(mention, (m) => m.substring(1).trim() !== username)

  if (!_.isEmpty(filteredMentions)) {
    comment = new Comment({
      ...params,
      valid: true,
      mentions: filteredMentions,
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

    for (let i = 0; i < filteredMentions.length; i++) {
      const result = new Mention({
        type: 'Comment',
        username: filteredMentions[i],
        parent_id: comment._id,
      })

      const newMention = result.save()
      mentions.push({ ...newMention.attrs, _id: newMention._id })
    }
  } else {
    comment = new Comment({
      ...params,
      valid: true,
      mentions: [],
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
  }

  return { ...comment.attrs, _id: comment._id }
}

function* createCommentSaga(action) {
  try {
    const comment = yield call(createComment, action)
    yield put({ type: CREATE_COMMENT_SUCCESS, payload: comment })
  } catch (error) {
    console.log(error)
    yield put({ type: CREATE_COMMENT_FAIL, payload: error.message })
  }
}

export default createCommentSaga
