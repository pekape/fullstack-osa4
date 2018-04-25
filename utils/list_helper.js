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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
