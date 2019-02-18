import _ from 'lodash'
import omitBy from './omitBy'

const compactArrayOrObject = (item) => {
  if (Array.isArray(item)) {
    return _.compact(item);
  }

  if (typeof item === 'object') {
    return omitBy(item, (prop) => (
      _.isEmpty(prop) && !_.isNumber(prop) && !_.isBoolean(prop)
    ));
  }
  return item;
}

export default compactArrayOrObject
