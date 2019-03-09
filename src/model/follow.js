import { Model } from 'radiks'

class Follow extends Model {
  static className = 'Follow'

  static schema = {
    username: { type: String, decrypted: true },
    followers: { type: Array, decrypted: true },
    followersCount: { type: Number, decrypted: true },
    following: { type: Array, decrypted: true },
    followingCount: { type: Number, decrypted: true }
  }
}

export default Follow
