const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb, giveBlog } = require('./test_helper')

describe('blog api', () => {

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
    const newBlog = giveBlog()

    const blogsBefore = await blogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const addedBlog = response.body

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter).toContainEqual(addedBlog)
  })

  test('adding a blog without likes-field sets likes to 0', async () => {
    const newBlog = giveBlog()
    delete newBlog.likes

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
    const addedBlog = response.body

    expect(addedBlog.likes).toBe(0)
  })

  test('adding a blog without title or url produces 400: Bad request', async () => {
    const newBlogs = [ giveBlog(), giveBlog(), giveBlog() ]
    delete newBlogs[0].title
    delete newBlogs[1].url
    delete newBlogs[2].title
    delete newBlogs[2].url

    const promiseArray = newBlogs.map(blog => {
      return api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
    })

    await Promise.all(promiseArray)
  })

  test('a blog can be deleted', async () => {
    const newBlog = giveBlog()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)

    const addedBlog = response.body

    const blogsBeforeDelete = await blogsInDb()

    expect(blogsBeforeDelete).toContainEqual(addedBlog)

    await api
      .delete(`/api/blogs/${addedBlog.id}`)
      .expect(204)

    const blogsAfterDelete = await blogsInDb()

    expect(blogsAfterDelete).not.toContainEqual(addedBlog)
    expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)
  })

  test('updating a blog works', async () => {
    const newBlog = giveBlog()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)

    const addedBlog = response.body

    const changedBlog = giveBlog()
    changedBlog.title = 'changed'

    const blogsBeforeUpdate = await blogsInDb()

    const responseUpdated = await api
      .put(`/api/blogs/${addedBlog.id}`)
      .send(changedBlog)
      .expect(200)

    const updatedBlog = responseUpdated.body

    const blogsAfterUdpate = await blogsInDb()

    expect(blogsAfterUdpate.length).toBe(blogsBeforeUpdate.length)
    expect(blogsAfterUdpate).not.toContainEqual(addedBlog)
    expect(blogsAfterUdpate).toContainEqual(updatedBlog)
    expect(updatedBlog.title).toMatch('changed')
  })

  afterAll(() => {
    server.close()
  })

})
