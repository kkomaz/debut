import { User } from 'radiks'
import BasicInformation from './basicInformation'

class DebutUser extends User {
  constructor(data) {
    super()
    this.data = data
  }

  async addBasicInfo() {
    const basicInformation = await BasicInformation.findOne({ username: this.data._id }) || null

    if (basicInformation) {
      return {...this.data, basicInformation: basicInformation.attrs }
    }

    return this.data
  }
}

export default DebutUser
