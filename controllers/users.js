const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const checkPasswordStrength = require('../utils/passwordCheck')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('tasks', { id: 0 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { email, name, password } = request.body

  const isDuplicate = await User.findOne({ email })
  if (isDuplicate) {
    return response.status(401).json({ error: "Email already exists" })
  }

  const passwordValidation = checkPasswordStrength(password)
  if (passwordValidation !== true) {
    return response.status(401).json({ error: passwordValidation })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter