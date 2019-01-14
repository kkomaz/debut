import axios from 'axios'
import _ from 'lodash'

async function fetchUserBlockstackApps(blockstackDapps, userDapps) {
  const promises = _.map(userDapps, async (userDapp) => {
    const blockstackApp = _.find(blockstackDapps, (bDapp) => bDapp.url === userDapp)

    if (blockstackApp) {
      return blockstackApp
    } else {
      try {
        const { data } = await axios.get(`${userDapp}/manifest.json`)
        await axios.post('/dapps.json', {...data, url: userDapp })
        return {...data, url: userDapp }
      } catch (e) {
        console.log(e.message)
      }
    }
  })

  const results = await Promise.all(promises)

  return _.compact(results)
}

export default fetchUserBlockstackApps
