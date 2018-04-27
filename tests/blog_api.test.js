const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

beforeEach(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const blogsInDatabase = await blogsInDb()

  const response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(blogsInDatabase.length)
})

test('returned blogs contain all authors', async () => {
  const blogsInDatabase = await blogsInDb()
  const authors = blogsInDatabase.map(b => b.author)

  const response = await api
    .get('/api/blogs')

  const contents = response.body.map(r => r.author)

  authors.forEach(author => expect(contents).toContain(author))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'otsikko',
    author: 'kirjoittaja',
    url: 'www.asdf.fi',
    likes: 10
  }

  const blogsBefore = await blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const addedBlog = await Blog.findOne(newBlog)
  const blogsAfter = await blogsInDb()

  expect(blogsAfter.length).toBe(blogsBefore.length + 1)
  expect(blogsAfter).toContainEqual(addedBlog)
})

test('adding a blog without likes-field sets likes to 0', async () => {
  const newBlog = {
    title: 'adsf',
    author: 'xvc',
    url: 'a.b.c'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const addedBlog = await Blog.findOne(newBlog)

  expect(addedBlog.likes).toBe(0)
})

test('adding a blog without title or url produces 400: Bad request', async () => {
  const newBlogs = [
    {
      author: 'xvc',
      url: 'a.b.c',
      likes: 5
    },
    {
      title: 'adsf',
      author: 'xvc',
      likes: 5
    },
    {
      author: 'xvc',
      likes: 5
    }
  ]

  const promiseArray = newBlogs.map(blog => {
    return api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
  })

  await Promise.all(promiseArray)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'otsikko',
    author: 'kirjoittaja',
    url: 'www.asdf.dfas',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const addedBlog = await Blog.findOne(newBlog)

  const blogsBeforeDelete = await blogsInDb()

  expect(blogsBeforeDelete).toContainEqual(addedBlog)

  await api
    .delete(`/api/blogs/${addedBlog.id}`)
    .expect(204)

  const blogsAfterDelete = await blogsInDb()

  expect(blogsAfterDelete).not.toContainEqual(addedBlog)
  expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)
})

afterAll(() => {
  server.close()
})
