import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { CREATE_SHARE_SUCCESS, CREATE_SHARE_FAIL } from 'actions'
import Share from 'model/share'
import Mention from 'model/mention'
import checkMentions from 'utils/mentions/checkMentions'

const createShare = async (action) => {
  const { params } = action
  let mentions = []
  const share = new Share({
    ...params,
    valid: true,
  })
  share.save()

  /**
   * Don't make this async await because don't want to wait for this 
  */
  const mention = [...new Set(checkMentions(params.text))]

  if (!_.isEmpty(mention)) {
    for (let i = 0; i < mention.length; i++) {
      const result = new Mention({
        type: 'Share',
        username: mention[i].substring(1).trim(),
        parent_id: share._id,
      })

      const newMention = result.save()
      mentions.push({ ...newMention.attrs, _id: newMention._id })
    }
  }

  return {
    share: { ...share.attrs, _id: share._id}
  }
}

function* createShareSaga(action) {
  try {
    const result = yield call(createShare, action)
    yield put({ type: CREATE_SHARE_SUCCESS, payload: result.share })
  } catch (error) {
    yield put({ type: CREATE_SHARE_FAIL, payload: error.message })
  }
}

export default createShareSaga
