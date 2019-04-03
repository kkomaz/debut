import { Model } from 'radiks';

export default class Vote extends Model {
  static className = "Vote";

  static schema = {
    comment_id: {
      type: String,
      decrypted: true,
    },
    share_id: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    }
  }
};
