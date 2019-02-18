import _ from 'lodash'
import Dapp from 'model/Dapp'

async function fetchUserBlockstackDapps(blockstackDapps, userDapps) {
  const result = []

  for (const userDapp of userDapps) {
    const blockstackDapp = _.find(blockstackDapps, (bDapp) => bDapp.url === userDapp)

    if (blockstackDapp) {
      console.log('already found')
      result.push(blockstackDapp)
    } else {
      console.log(`adding ${blockstackDapp} to db`)
      const params = {
        url: userDapp
      }
      const dapp = new Dapp(params)
      const savedDapp = await dapp.save()
      result.push(savedDapp)
      console.log(`completed ${blockstackDapp} to db`)
    }
  }

  return result;
}

export default fetchUserBlockstackDapps
