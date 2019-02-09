import { User } from 'radiks';
import Share from './share'

class debutUser extends User {
  async afterFetch() {
    this.tasks = await Share.fetchList({
      username: this._id
    })
  }
}

export default debutUser
