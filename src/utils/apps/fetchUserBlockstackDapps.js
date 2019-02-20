import _ from 'lodash'
import Dapp from 'model/Dapp'

async function fetchUserBlockstackDapps(blockstackDapps, userDapps) {
  const result = []
  const newDapps = []

  for (const userDapp of userDapps) {
    const blockstackDapp = _.find(blockstackDapps, (bDapp) => bDapp.url === userDapp)

    if (blockstackDapp) {
      result.push(blockstackDapp)
    } else {
      console.log(`adding ${userDapp} to db`)
      const params = {
        url: userDapp
      }

      try {
        const dapp = new Dapp(params)
        const savedDapp = await dapp.save()
        result.push(savedDapp)
        newDapps.push(savedDapp)
        console.log(`completed ${userDapp} to db`)
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  return {
    dapps: result,
    newDapps: _.map(newDapps, 'attrs')
  }
}

export default fetchUserBlockstackDapps
