import _ from 'lodash'

const filterListFromList = (currentShares, list) => {
  return _.reduce(list, (acc, curr) => {

    if (_.find(currentShares, {_id: curr._id })) {
      return acc
    }

    return [...acc, curr]
  }, currentShares)
}

export default filterListFromList
