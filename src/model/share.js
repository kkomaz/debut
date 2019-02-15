import { Model } from 'radiks'

class Share extends Model {
  static schema = {
    text: { type: String, required: true },
    valid: { type: Boolean, default: true },
    username: {
      type: String,
      required: true,
      decrypted: true
    },
    imageFile: { type: String }
  }
}

export default Share
