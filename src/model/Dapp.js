import { Model } from 'radiks'

class Dapp extends Model {
  static className = 'Dapp'

  static schema = {
    icons: { type: Array, decrypted: true },
    name: { type: String, decrypted: true },
    start_url: { type: String, decrypted: true },
    url: { type: String, decrypted: true }
  }
}

export default Dapp
