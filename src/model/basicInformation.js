import { Model } from 'radiks'

class BasicInformation extends Model {
  static className = 'BasicInformation'

  static schema = {
    description: { type: String, decrypted: true },
    username: { type: String, decrypted: true }
  }
}

export default BasicInformation
