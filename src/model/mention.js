import { Model } from 'radiks';

export default class Mention extends Model {
  static className = "Mention";

  static schema = {
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
};
