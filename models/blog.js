const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.statics.format = blog => ({
  id: blog._id.toString(),
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
