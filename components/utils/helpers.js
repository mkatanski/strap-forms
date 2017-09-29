export const isValid = (errors) => {
  if (Object.keys(errors).length === 0) {
    return true
  }

  let valid = true
  Object.keys(errors).forEach((errKey) => {
    if (Object.keys(errors[errKey]).length !== 0) {
      valid = false
    }
  })

  return valid
}

export const isArray = o => Object.prototype.toString.call(o) === '[object Array]'
