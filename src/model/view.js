import { Model } from 'radiks';

export default class View extends Model {
  static className = "View";

  static schema = {
    type: {
      type: String
    },
    parent_id: {
      type: String,
    }
  }
};
