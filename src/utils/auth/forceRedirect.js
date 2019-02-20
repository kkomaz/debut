const forceRedirect = (history) => {
  setTimeout(() => {
    history.push('/')
  }, 5000)
}

export default forceRedirect
