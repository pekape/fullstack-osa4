const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of a list of single blog equals that blogs likes', () => {
    expect(listHelper.totalLikes(singleBlog)).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogList)).toBe(36)
  })
})

describe('favorite blog', () => {

  test('of empty list return error', () => {
    expect(listHelper.favoriteBlog([])).toEqual(error)
  })

  test('of list of single blog to be that blog', () => {
    expect(listHelper.favoriteBlog(singleBlog)).toEqual(singleBlog[0])
  })

  test('of a bigger list to be the right blog', () => {
    expect(listHelper.favoriteBlog(blogList)).toEqual(blogList[2])
  })
})

describe('most blogs', () => {
  const singleAuthor = {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }

  const activeAuthor = {
    author: 'Robert C. Martin',
    blogs: 3
  }

  test('of empty list return error', () => {
    expect(listHelper.mostBlogs([])).toEqual(error)
  })

  test('of list of single blog to be that author and 1 blog', () => {
    expect(listHelper.mostBlogs(singleBlog)).toEqual(singleAuthor)
  })

  test('of bigger list to be right author with correct number of blogs', () => {
    expect(listHelper.mostBlogs(blogList)).toEqual(activeAuthor)
  })

})

describe('most likes', () => {
  const singleAuthor = {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  const likedAuthor = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('of empty list return error', () => {
    expect(listHelper.mostLikes([])).toEqual(error)
  })

  test('of list of single blog to be that author and likes', () => {
    expect(listHelper.mostLikes(singleBlog)).toEqual(singleAuthor)
  })

  test('of bigger list to be right author with correct number of likes', () => {
    expect(listHelper.mostLikes(blogList)).toEqual(likedAuthor)
  })

})

const error = {
  error: 'empty list'
}

const singleBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]
