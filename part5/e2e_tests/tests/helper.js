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
  await page.getByText(`${content.title} by ${content.author}`).waitFor()
}

const likeTimes = async (page, button, n) => {
  for (let i = 0; i<n; i++) {
    await button.click()
    await page.getByText(`likes ${i+1}`).waitFor()
  }
}

export { loginWith, createBlog, likeTimes }