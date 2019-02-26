import { User } from 'radiks'
import BasicInformation from './basicInformation'

class DebutUser extends User {
  static className = 'DebutUser'

  async afterFetch() {
    this.basicInformation = await BasicInformation.findOne({ username: this._id })
  }
}

export default DebutUser
