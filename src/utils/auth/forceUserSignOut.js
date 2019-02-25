import toggleNotification from 'utils/notifier/toggleNotification'

const forceUserSignOut = (userSession, message, timer = 5000) => {
  toggleNotification('error', message)

  setTimeout(() => {
    userSession.signUserOut()
    window.location = '/'
  }, timer)
}

export default forceUserSignOut
