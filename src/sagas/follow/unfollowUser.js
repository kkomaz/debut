import { put, call } from 'redux-saga/effects'
import _ from 'lodash'
import { SET_UNFOLLOW_SUCCESS, SET_UNFOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const unfollowUser = async (action) => {
  const result = {}
  const { payload } = action
  const sessionFollow = await Follow.findOne({ username: payload.sessionUsername })
  const viewedFollow = await Follow.findOne({ username: payload.username })

  const following = _.filter(sessionFollow.attrs.following, (followingUser) => followingUser !== payload.username)
  const followers = _.filter(viewedFollow.attrs.followers, (followersUser) => followersUser !== payload.sessionUsername)

  sessionFollow.update({
    following,
    followingCount: following.length
  })
  const updatedFollowing = await sessionFollow.save()
  result[`${payload.sessionUsername}`] = updatedFollowing.attrs

  viewedFollow.update({
    followers,
    followersCount: followers.length
  })
  const updatedFollowers = await viewedFollow.save()
  result[`${payload.username}`] = updatedFollowers.attrs

  return result
}

function* unfollowUserSaga(action) {
  try {
    const follow = yield call(unfollowUser, action)
    yield put({ type: SET_UNFOLLOW_SUCCESS, payload: {
      following: follow[`${action.payload.sessionUsername}`],
      followers: follow[`${action.payload.username}`]
    }})
  } catch (error) {
    yield put({ type: SET_UNFOLLOW_FAIL, payload: error.message })
  }
}

export default unfollowUserSaga
