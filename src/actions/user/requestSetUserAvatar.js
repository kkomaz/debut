import { REQUEST_SET_USER_AVATAR } from 'actions'

const requestSetUserAvatar = (imageFile, username) => {
  return {
    type: REQUEST_SET_USER_AVATAR,
    payload: {
      profileImgUrl: imageFile,
      username
    }
  }
}

export default requestSetUserAvatar
