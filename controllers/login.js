const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email }).populate('tasks')

  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid email or password'
    })
  }

  const userToken = {
    email: user.email,
    id: user._id
  }

  const token = jwt.sign(userToken, process.env.SECRET)
  response.status(200).send({ token, email: user.email,
    name: user.name, id: user._id, tasks: user.tasks })
})

module.exports = loginRouter