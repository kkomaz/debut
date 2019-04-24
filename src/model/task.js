import { Model } from 'radiks';

export default class Task extends Model {
  static className = "Task";

  static schema = {
    type: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
    twitter_id: {
      type: String,
      decrypted: true,
    },
    tweet_link: {
      type: String,
      decrypted: true,
    },
    btc_address: {
      type: String,
      decrypted: true,
    },
    month: {
      type: Number,
      decrypted: true,
    }
  }
};
