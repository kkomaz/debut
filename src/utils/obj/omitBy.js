import _ from 'lodash'

const omitBy = (obj, predicate) => {
  return _.reduce(obj, (acc, value, key) => {
    if (predicate(value, key)) {
      return acc;
    }
    return _.merge(acc, { [key]: value });
  }, {});
}

export default omitBy
