import { User } from 'radiks'
import BasicInformation from './basicInformation'

class DebutUser extends User {
  constructor(data) {
    super()
    this.data = data
  }

  async addBasicInfo() {
    const basicInformation = await BasicInformation.findOne({ username: this._id }) || null
    return {...this.data, basicInformation }
  }
}

export default DebutUser
