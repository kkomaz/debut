import { User } from 'radiks'
import BasicInformation from './basicInformation'

class DebutUser extends User {
  async afterFetch() {
    this.basicInformation = await BasicInformation.findOne({ username: this._id })
  }
}

export default DebutUser
