const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('api/users', {
      data: {
        name: 'Ángel Abad',
        username: 'angel',
        password: 'abad'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      const blog = {
        title: 'my first blog',
        author: 'author',
        url: 'http://www.google.com'
      }
      await createBlog(page, blog)
    })

    describe('and a blog exists', () => {
        beforeEach(async ({page}) => {
          const blog = {
            title: 'my second blog',
            author: 'author2',
            url: 'http://www.google.com'
          }
          await createBlog(page, blog)
        })

        test('a blog can be liked', async ({ page }) => {
          await likeBlog(page, 'my second blog', 1)
        })

        test('a blog can be deleted', async ({ page }) => {
          const noteElement = await page.locator('span', { hasText: 'my second blog' }).locator('..')
          await noteElement.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept());
          await noteElement.getByRole('button', { name: 'remove' }).click()
          await expect(noteElement.getByText('my second blog')).not.toBeVisible()
        })

        test('another user can not delete it', async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'angel', 'abad')
          await expect(page.getByText('Ángel Abad logged-in')).toBeVisible()
          const noteElement = await page.locator('span', { hasText: 'my second blog' }).locator('..')
          await noteElement.getByRole('button', { name: 'view' }).click()
          await expect(noteElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
    })

    describe('and several blog exist', () => {
        beforeEach(async ({page}) => {
          const thirdBlog = {
            title: 'my third blog',
            author: 'author3',
            url: 'http://www.google.com'
          }
          const fourthBlog = {
            title: 'my fourth blog',
            author: 'author4',
            url: 'http://www.google.com'
          }
          const fifthBlog = {
            title: 'my fifth blog',
            author: 'author5',
            url: 'http://www.google.com'
          }
          await createBlog(page, thirdBlog)
          await createBlog(page, fourthBlog)
          await createBlog(page, fifthBlog)
        })

        test('blogs are ordered by likes', async ({ page }) => {
          await likeBlog(page, 'my third blog', 1)
          await likeBlog(page, 'my fourth blog', 1)
          await likeBlog(page, 'my fourth blog', 2)
          await likeBlog(page, 'my fifth blog', 1)
          await likeBlog(page, 'my fifth blog', 2)
          await likeBlog(page, 'my fifth blog', 3)

          const blogs = page.locator('.blog-info')
          const titles = await blogs.allTextContents()
          
          expect(titles).toEqual([
            'my fifth blog author5',
            'my fourth blog author4',
            'my third blog author3'
          ])
        })
    })
  })
})