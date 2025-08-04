const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeTimes } = require('./helper')

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
          await page.getByText('my second blog').getByRole('button', { name: 'view' }).click()
          const button = page.getByText('my second blog').getByRole('button', { name: 'like'})
          await likeTimes(page, button, 1)
        })

        test('a blog can be deleted', async ({ page }) => {
          await page.getByText('my second blog').getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept());
          await page.getByText('my second blog').getByRole('button', { name: 'remove' }).click()
          await expect(page.getByText('my second blog author2')).not.toBeVisible()
        })

        test('another user can not delete it', async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'angel', 'abad')
          await expect(page.getByText('Ángel Abad logged-in')).toBeVisible()
          await page.getByText('my second blog').getByRole('button', { name: 'view' }).click()
          await expect(page.getByText('my second blog').getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
    })

    describe('and several blog exist', () => {
        beforeEach(async ({page}) => {
          const firstBlog = {
            title: 'blog1',
            author: 'author1',
            url: 'http://www.google.com'
          }
          const secondBlog = {
            title: 'blog2',
            author: 'author2',
            url: 'http://www.google.com'
          }
          const thirdBlog = {
            title: 'blog3',
            author: 'author3',
            url: 'http://www.google.com'
          }
          await createBlog(page, firstBlog)
          await createBlog(page, secondBlog)
          await createBlog(page, thirdBlog)
        })

        test('blogs are ordered by likes', async ({ page }) => {
          await page.getByText('blog1').getByRole('button', { name: 'view'}).click()
          await page.getByText('blog2').getByRole('button', { name: 'view'}).click()
          await page.getByText('blog3').getByRole('button', { name: 'view'}).click()

          await page.pause()
          const button1 = page.getByText('blog1').getByRole('button', { name: 'like'})
          await likeTimes(page, button1, 1)
          await page.getByText('blog1').getByRole('button', { name: 'hide'}).click()

          let button2 = page.getByText('blog2').getByRole('button', { name: 'like'})
          await likeTimes(page, button2, 3)
          await page.getByText('blog2').getByRole('button', { name: 'hide'}).click()

          let button3 = page.getByText('blog3').getByRole('button', { name: 'like'})
          await likeTimes(page, button3, 2)
          await page.getByText('blog3').getByRole('button', { name: 'hide'}).click()

          const blogDivs = await page.locator('div.blog').all()

          expect(blogDivs[0]).toHaveText('blog2 by author2') 
          expect(blogDivs[1]).toHaveText('blog3 by author3') 
          expect(blogDivs[2]).toHaveText('blog1 by author1') 
        })
    })
  })
})