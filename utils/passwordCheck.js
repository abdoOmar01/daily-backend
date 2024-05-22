const checkPasswordStrength = (password) => {
  if (password.length < 8) {
    return "Password should be at least 8 characters long"
  }

  if (!password.match(/[a-z]+/)) {
    return "Password should contain a lowercase letter"
  }

  if (!password.match(/[A-Z]+/)) {
    return "Password should contain an uppercase letter"
  }
  if (!password.match(/[0-9]+/)) {
    return "Password should contain a number"
  }
  if (!password.match(/[!@#$%^&*()-_=+<>?:;'"]+/)) {
    return "Password should contain a special character"
  }

  return true
}

module.exports = checkPasswordStrength