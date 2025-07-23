import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({message: '', type: ''})

  const blogFormRef = useRef()

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <Togglable buttonLabel="new note" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const handleLogin = async event => {
    event.preventDefault()

    try { 
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({message: `Logged in as ${user.name}`, type: 'success'})
      resetNotification()
    } catch (error) {
      setNotification({message: error.response.data.error, type: 'error'})
      resetNotification()
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    blogService.setToken(null)
    setUser(null)
    setNotification({message: `Logged out`, type: 'success'})
    resetNotification()
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()

    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      setNotification({message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`, type: 'success'})
      resetNotification()
    } catch (error) {
      setNotification({message: error.response.data.error, type: 'error'})
      resetNotification()
    }
  }

  const resetNotification = () => { 
    setTimeout(() => {
      setNotification({message: '', type: ''})
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? 
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App