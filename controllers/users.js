const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { __v: 0, user: 0 })

  response.json(users.map(User.format))
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if(body.password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters' })
    }

    const existingUser = await User.find({ username: body.username })

    if (existingUser.length > 0) {
      return response.status(409).json({ error: 'username already exists' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(User.format(savedUser))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = usersRouter
