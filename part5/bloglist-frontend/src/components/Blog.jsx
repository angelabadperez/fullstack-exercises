import { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const showWhenShowDetails = { display: showDetails ? '' : 'none' }
  const detailsButtonTitle = showDetails ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailsButtonStyle = {
    marginLeft: 5
  }

  const updateBlog = (event) => {
    event.preventDefault()

    likeBlog(
      blog.id,
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      }
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button 
          style={detailsButtonStyle} 
          onClick={() => setShowDetails(!showDetails) }
        >
          {detailsButtonTitle}
        </button>
        <div style={showWhenShowDetails} className="blog-details">
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={updateBlog}>like</button></p>
          <p>{blog.user.name}</p>
        </div>
      </div>
    </div>  
  )
}

export default Blog