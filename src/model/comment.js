import { Model } from 'radiks'

class Comment extends Model {
  static className = "Comment"

  static schema = {
    share_id: {
      type: String,
      decrypted: true
    },
    comment_id: {
      type: String,
      decrypted: true
    },
    creator: {
      type: String,
      decrypted: true
    },
    text: {
      type: String,
      decrypted: true
    }
  }
}

export default Comment
