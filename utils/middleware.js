const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    const message = error.errors[Object.keys(error.errors)[0]].properties.message
    return response.status(400).json({ error: message })
  } else if (error.name === 'MongoServerError' &&
      error.message.includes('E11000 duplicate key error')) {
        const message = error.errors[Object.keys(error.errors)[0]].properties.message
    return response.status(400).json({
      error: message
    })
  }

  next(error)
}

module.exports = {
  errorHandler
}