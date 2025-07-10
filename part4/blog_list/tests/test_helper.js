const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 23,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const insertUserInDb = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  const savedUser = await user.save()
  return savedUser.toJSON()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const authorizationToken = async () => {
  const users = await usersInDb()
  const firstUser = users[0]
  if (!firstUser) {
    return null
  }

  const userForToken = {
    username: firstUser.username,
    id: firstUser.id,
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  return `Bearer ${token}`
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  insertUserInDb,
  usersInDb,
  authorizationToken
}