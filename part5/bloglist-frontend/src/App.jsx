import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notification, setNotification] = useState({message: '', type: ''})

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

  const handleCreateBlog = async event => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    try {
      const createdBlog = await blogService.create(newBlog)
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
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
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>create new</h2>
          <form onSubmit={handleCreateBlog}>
            <div>
              title
              <input
                type="text"
                value={newBlogTitle}
                name="Title"
                onChange={({ target }) => setNewBlogTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                type="text"
                value={newBlogAuthor}
                name="Author"
                onChange={({ target }) => setNewBlogAuthor(target.value)}
              />
            </div>
            <div>
              url
              <input
                type="text"
                value={newBlogUrl}
                name="Url"
                onChange={({ target }) => setNewBlogUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App