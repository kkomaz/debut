import { Model } from 'radiks'
import Comment from 'model/comment'
import Vote from 'model/vote'
import _ from 'lodash'

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
      type: Array,
      decrypted: true
    },
    commentCount: {
      type: Number,
      decrypted: true
    },
    mentions: {
      type: Array,
      decrypted: true,
    }
  }

  async afterFetch() {
    const comments = await Comment.fetchList({
      share_id: this._id,
      valid: true,
    })

    const votes = await Vote.fetchList({
      share_id: this._id
    })

    this.comments = _.map(comments, 'attrs')
    this.votes = _.map(votes, 'attrs')
  }
}

export default Share
