import { useState } from 'react'

const Blog = ({ blog }) => {
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
          <p>likes {blog.likes} <button>like</button></p>
          <p>{blog.user.name}</p>
        </div>
      </div>
    </div>  
  )
}

export default Blog