const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return { error: 'empty list' }
  }

  return blogs.reduce((mostLiked, blog) => {
    return blog.likes > mostLiked.likes ? blog : mostLiked
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return { error: 'empty list' }
  }

  const authors = []

  blogs.forEach(blog => {
    const found = authors.find(a => a.author === blog.author)
    found ? found.blogs++ : authors.push({ author: blog.author, blogs: 1 })
  })

  authors.sort((a, b) => b.blogs - a.blogs)

  return authors[0]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return { error: 'empty list' }
  }

  const authors = []

  blogs.forEach(blog => {
    const found = authors.find(a => a.author === blog.author)
    found ? found.likes += blog.likes : authors.push({ author: blog.author, likes: blog.likes })
  })

  return authors.reduce((best, author) => author.likes > best.likes ? author : best)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
