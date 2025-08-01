const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user: user._id })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(blog._id)
    response.status(204).end()
  } else {
    return response.status(400).json({ error: 'owner of blog not matching' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlog = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const user = await User.findById(newBlog.user)

  blog.title = newBlog.title
  blog.author = newBlog.author
  blog.url = newBlog.url
  blog.likes = newBlog.likes
  blog.user = user

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter