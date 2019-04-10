const checkMentions = (text) => {
  const mention = text.match(/@[a-z0-9]+\.+[a-z]+\.?[a-z]+/gim)
  return mention
}

export default checkMentions
