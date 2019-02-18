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
      console.log(`adding ${userDapp} to db`)
      const params = {
        url: userDapp
      }

      try {
        const dapp = new Dapp(params)
        const savedDapp = await dapp.save()
        console.log(savedDapp, 'savedDapp')
        result.push(savedDapp)
        console.log(`completed ${userDapp} to db`)
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  return result;
}

export default fetchUserBlockstackDapps
