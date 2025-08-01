const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(content.title)
  await page.getByTestId('author').fill(content.author)
  await page.getByTestId('url').fill(content.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('span', { hasText: content.title }).waitFor()
}

const likeBlog = async (page, title, expectedLikes) => {
  let noteElement = await page.locator('span', { hasText: title }).locator('..')
  const isExpanded = await noteElement.getByRole('button', { name: 'hide' }).isVisible()
  if (!isExpanded) {
    await noteElement.getByRole('button', { name: 'view' }).click()
  }
  await noteElement.getByRole('button', { name: 'like' }).click()
}

export { loginWith, createBlog, likeBlog }