import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let updateBlog
  let user

  beforeEach(() => {
    const blog = {
        id: '68810d519a9038e55015f8e0',
        title: 'A testing note',
        author: 'Angel',
        url: 'https://www.google.com',
        likes: 0,
        user: {
            id: '123445519a9038e55015f8e0',
            username: 'root',
            name: 'root'
        }
    }

    updateBlog = vi.fn()
    user = userEvent.setup()

    container = render(
      <Blog blog={blog} likeBlog={updateBlog} />
    ).container
  })

  test('renders title and author but not URL and likes by default', async () => {
    const title = await screen.findByText('A testing note Angel')
    expect(title).toBeDefined()

    const details = container.querySelector('.blog-details')
    expect(details).toHaveStyle('display: none')
  })

  test('URL and likes shown when button clicked', async () => {
    const button = screen.getByText('view')
    await user.click(button)

    const details = container.querySelector('.blog-details')
    expect(details).not.toHaveStyle('display: none')

    // This is not required as we can only check the visibility of the .blog-details div
    const url = screen.getByText('https://www.google.com')
    expect(url).toBeDefined()

    const likes = screen.getByText('likes', { exact: false })
    expect(likes).toBeDefined()
  })

  test('after clicking like button twice, it works fine', async () => {
    const viewDetailsButton = screen.getByText('view')
    await user.click(viewDetailsButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})