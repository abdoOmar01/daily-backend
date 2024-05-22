const jwt = require('jsonwebtoken')
const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

const getToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }

  return null
}

tasksRouter.get('/', async (request, response) => {
  const tasks = await Task.find({}).populate('user', { name: 1 })
  response.json(tasks)
})

tasksRouter.get('/user/:id', async (request, response) => {
  const tasks = await Task.find({ user: request.params.id })
  response.json(tasks)
})

tasksRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getToken(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  const task = new Task({
    name: body.name,
    user: user._id
  })

  const savedTask = await task.save()
  user.tasks = user.tasks.concat(savedTask._id)
  await user.save()

  response.status(201).json(savedTask)
})

tasksRouter.put('/:id', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getToken(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const object = {
    name: body.name,
    done: body.done,
    important: body.important,
    dateCreated: body.dateCreated,
    dueDate: body.dueDate,
    deleted: body.deleted,
    user: body.user
  }
  
  const updatedTask = await Task.findByIdAndUpdate(request.params.id,
    object, { new: true, runValidators: true, context: 'query' })

  response.json(updatedTask)
})

tasksRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getToken(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  await Task.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = tasksRouter