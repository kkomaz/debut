import _ from 'lodash'

const updateObjFromList = (list, obj) => {
  if (_.isEmpty(list)) {
    return [obj]
  }

  return _.reduce(list, (acc, curr) => {
    if (curr._id === obj._id) {
      return [...acc, obj]
    }

    return [...acc, curr]
  }, [])
}

export default updateObjFromList
