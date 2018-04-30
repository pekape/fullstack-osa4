const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb, giveUser } = require('./test_helper')

describe('user api', () => {

  beforeEach(async () => {
    await User.remove({})
  })

  test('can create valid user', async () => {
    const user = giveUser()

    const usersBefore = await usersInDb()

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(usersAfter.map(u => u.name)).toContainEqual(user.name)
  })

  test('can\'t create user with password length < 3', async () => {
    const user = giveUser()
    user.password = 'xd'

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body.error).toMatch(/password/)
  })

  test('can\'t create user if username already exists', async () => {
    const user = giveUser()
    const anotherUser = {
      username: user.username,
      name: 'zxcv',
      adult: true,
      password: '123455678'
    }

    await api
      .post('/api/users')
      .send(user)

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(anotherUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body.error).toMatch(/username/)
  })

  test('if adult-field not set when adding user, default to true', async () => {
    const user = giveUser()
    delete user.adult

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(response.body.adult).toEqual(true)
  })

  afterAll(() => {
    server.close()
  })

})
