import { Model } from 'radiks'

class Follow extends Model {
  static className = 'Follow'

  static schema = {
    username: { type: String, decrypted: true },
    followers: { type: Array, decrypted: true },
    following: { type: Array, decrypted: true }
  }
}

export default Follow
