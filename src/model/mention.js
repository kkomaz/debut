import { Model } from 'radiks'
import Share from 'model/share'
import Comment from 'model/comment'

export default class Mention extends Model {
  static className = "Mention";

  static schema = {
    creator: {
      type: String,
      decrypted: true,
    },
    type: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
    parent_id: {
      type: String,
      decrypted: true,
    }
  }

  async afterFetch() {
    let result = this.attrs.type === 'Comment' ? await Comment.findOne({ _id: this.attrs.parent_id }) : await Share.findOne({ _id: this.attrs.parent_id })

    if (result === undefined) {
      debugger
      this.parent = {}
    } else {
      this.parent = result.attrs
    }
  }
};
