import { put, call } from 'redux-saga/effects'
import { SET_FOLLOW_SUCCESS, SET_FOLLOW_FAIL } from 'actions'
import Follow from 'model/follow'

const followUser = async (action) => {
  const result = {}
  const { payload } = action
  const sessionFollow = await Follow.findOne({ username: payload.sessionUsername })
  const viewedFollow = await Follow.findOne({ username: payload.username })

  if (!sessionFollow) {
    const createdFollow = new Follow({
      username: payload.sessionUsername,
      following: [payload.username],
      followers: [],
      followingCount: 1,
      followerCount: 0
    })
    createdFollow.save()
    result[`${payload.sessionUsername}`] = { ...createdFollow.attrs, _id: createdFollow._id }
  }

  if (!viewedFollow) {
    const createdFollow = new Follow({
      username: payload.username,
      following: [],
      followers: [payload.sessionUsername],
      followingCount: 0,
      followerCount: 1
    })
    createdFollow.save()
    result[`${payload.username}`] = { ...createdFollow.attrs, _id: createdFollow._id }
  }

  if (!result[`${payload.sessionUsername}`]) {
    const following = [...payload.following, payload.username]
    sessionFollow.update({
      following,
      followingCount: following.length
    })

    const updatedFollowing = await sessionFollow.save()
    result[`${payload.sessionUsername}`] = updatedFollowing.attrs
  }

  if (!result[`${payload.username}`]) {
    const followers = [...payload.followers, payload.sessionUsername]
    viewedFollow.update({
      followers,
      followerCount: followers.length
    })

    const updatedFollowers = await viewedFollow.save()
    result[`${payload.username}`] = updatedFollowers.attrs
  }

  return result
}

function* followUserSaga(action) {
  try {
    const follow = yield call(followUser, action)
    yield put({ type: SET_FOLLOW_SUCCESS, payload: {
      following: follow[`${action.payload.sessionUsername}`],
      followers: follow[`${action.payload.username}`]
    }})
  } catch (error) {
    console.log(error.message)
    yield put({ type: SET_FOLLOW_FAIL, payload: error.message })
  }
}

export default followUserSaga
