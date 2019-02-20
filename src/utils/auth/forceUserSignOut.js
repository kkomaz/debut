import toggleNotification from 'utils/notifier/toggleNotification'

const forceUserSignOut = (userSession, message) => {
  toggleNotification('error', message)

  setTimeout(() => {
    userSession.signUserOut()
    window.location = '/'
  }, 5000)
}

export default forceUserSignOut
