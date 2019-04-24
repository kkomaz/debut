import { Model } from 'radiks';

export default class Task extends Model {
  static className = "Task";

  static schema = {
    type: {
      type: String,
    },
    username: {
      type: String,
    },
    twitter_id: {
      type: String,
    },
    tweet_link: {
      type: String,
    },
    btc_address: {
      type: String,
    },
    month: {
      type: Number,
    }
  }
};
