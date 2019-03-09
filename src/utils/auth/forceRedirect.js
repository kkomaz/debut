import toggleNotification from 'utils/notifier/toggleNotification'

const forceRedirect = (history, message) => {
  history.push('/')
  toggleNotification('warning', message)
}

export default forceRedirect
