import { Model } from 'radiks'

class Share extends Model {
  static className = "Share"

  static schema = {
    text: {
      type: String,
      required: true,
      decrypted: true,
    },
    valid: {
      type: Boolean,
      default: true,
      decrypted: true,
    },
    username: {
      type: String,
      required: true,
      decrypted: true
    },
    imageFile: {
      type: String,
      decrypted: true,
    },
    comments: {
      type: Array
    }
  }
}

export default Share
