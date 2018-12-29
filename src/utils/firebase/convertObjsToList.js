const convertObjsToList = (data) => {
  const list = []

  for (const key in data) {
    list.push({ ...data[key], id: key })
  }

  return list
}

export default convertObjsToList
