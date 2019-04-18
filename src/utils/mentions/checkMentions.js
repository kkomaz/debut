import _ from 'lodash'
const checkMentions = (text) => {
  const mention = text.match(/@[a-z0-9]+\.+[a-z]+\.?[a-z]+/gim)

  return _.map(mention, (username) => {
    return username.substring(1).trim()
  })
}

export default checkMentions
