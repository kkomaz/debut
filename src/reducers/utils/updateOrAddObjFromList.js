const updateOrAddObjFromList = (arr, obj) => {
  const index = arr.findIndex((e) => e._id === obj._id);

  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }

  return arr
}

export default updateOrAddObjFromList
