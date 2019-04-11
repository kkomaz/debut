import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { CREATE_SHARE_SUCCESS, CREATE_SHARE_FAIL } from 'actions'
import Share from 'model/share'
import Mention from 'model/mention'
import checkMentions from 'utils/mentions/checkMentions'

const createShare = async (action) => {
  const { params, username } = action.payload
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
  const filteredMentions = _.filter(mention, (m) => m.substring(1).trim() !== username)

  if (!_.isEmpty(filteredMentions)) {
    for (let i = 0; i < filteredMentions.length; i++) {
      const result = new Mention({
        type: 'Share',
        username: filteredMentions[i].substring(1).trim(),
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
