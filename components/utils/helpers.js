export const isValid = (errors) => {
  if (Object.keys(errors).length === 0) {
    return true
  }

  let _isValid = true
  Object.keys(errors).forEach((errKey) => {
    if (Object.keys(errors[errKey]).length !== 0) {
      _isValid = false
    }
  })

  return _isValid
}

export const isArray = (o) => Object.prototype.toString.call(o) !== '[object Array]'
