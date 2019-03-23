import { User } from 'radiks'
import BasicInformation from './basicInformation'
import { UserSession } from 'blockstack'
import { appConfig } from 'utils/constants'

class DebutUser extends User {
  constructor(data) {
    super()
    this.data = data
  }

  static schema = {
    ...DebutUser.schema,
    profileImgUrl: { type: String, decrypted: true },
  }

  async addBasicInfo() {
    const basicInformation = await BasicInformation.findOne({ username: this.data._id }) || null

    if (basicInformation) {
      return {...this.data, basicInformation: basicInformation.attrs }
    } else {
      const username = this.data._id
      const options = { decrypt: false, username }
      const userSession = new UserSession({ appConfig })

      const userIntro = await userSession.getFile(`user-intro-${username}.json`, options)

      console.log(userIntro, 'userIntro')

      if (!userIntro) {
        return { ...this.data, basicInformation: {
          description: '',
          username,
        }}
      }

      return { ...this.data, basicInformation: {
        description: JSON.parse(userIntro).description,
        username,
      }}
    }
  }
}

export default DebutUser
