import _ from 'lodash'
import Dapp from 'model/Dapp'

async function fetchUserBlockstackApps2(blockstackDapps, userDapps) {
  const result = []

  for (const userDapp of userDapps) {
    const blockstackDapp = _.find(blockstackDapps, (bDapp) => bDapp.attrs.url === userDapp)

    if (blockstackDapp) {
      result.push(blockstackDapp)
    } else {
      const params = {
        url: userDapp
      }
      const dapp = new Dapp(params)
      const savedDapp = await dapp.save()
      result.push(savedDapp)
    }
  }

  return result;
}

export default fetchUserBlockstackApps2
