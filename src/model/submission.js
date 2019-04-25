import { Model } from 'radiks';

export default class Submission extends Model {
  static className = "Submission"

  static schema = {
    task_id: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
    approved: {
      type: Boolean,
      decrypted: true,
    }
  }
}
