import { User } from 'radiks'
import { UserSession } from 'blockstack'
import _ from 'lodash'
import { appConfig } from 'utils/constants'

class DebutUser extends User {
  constructor(data) {
    super()
    this.data = data
  }

  static schema = {
    ...DebutUser.schema,
    profileImgUrl: { type: String, decrypted: true },
    name: { type: String, decrypted: true },
    description: { type: String, decrypted: true },
    area: { type: String, decrypted: true },
    websiteUrl: { type: String, decrypted: true }
  }

  async addBasicInfo() {
    if (_.isEmpty(this.data.description)) {
      const username = this.data._id
      const options = { decrypt: false, username }
      const userSession = new UserSession({ appConfig })

      const userIntro = await userSession.getFile(`user-intro-${username}.json`, options)

      if (!userIntro) {
        return { ...this, data: { ...this.data, description: '' }}
      }

      return { ...this, data: { ...this.data, description: JSON.parse(userIntro).description }}
    }

    return this
  }
}

export default DebutUser
