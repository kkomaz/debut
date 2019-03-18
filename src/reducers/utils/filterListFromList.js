import _ from 'lodash'

const filterListFromList = (currentList, list) => {
  return _.reduce(list, (acc, curr) => {
    if (_.find(currentList, {_id: curr._id })) {
      return acc
    }

    return [...acc, curr]
  }, currentList)
}

export default filterListFromList
