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
    parent_username: {
      type: String,
      decrypted: true,
    },
    link: {
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
