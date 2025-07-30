import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  let createBlog
  let user

  beforeEach(() => {
    createBlog = vi.fn()
    user = userEvent.setup()

    container = render(
      <BlogForm createBlog={createBlog} />
    ).container
  })

  test('calls onSubmit', async () => {
    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')
    const createButtonButton = screen.getByText('create')
    const expectedBlog = {
        title: 'New blog by tests',
        author: 'Author test',
        url: 'https://www.google.com'
    }

    await user.type(titleInput, 'New blog by tests')
    await user.type(authorInput, 'Author test')
    await user.type(urlInput, 'https://www.google.com')
    await user.click(createButtonButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual(expectedBlog)
  })
})