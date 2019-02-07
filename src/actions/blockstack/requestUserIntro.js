import { REQUEST_USER_INTRO } from 'actions'

const requestUserIntro = (username, userSession) => {
  return {
    type: REQUEST_USER_INTRO,
    payload: {
      username,
      userSession,
    }
  }
};

export default requestUserIntro
