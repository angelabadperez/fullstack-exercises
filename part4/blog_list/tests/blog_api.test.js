const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('all blogs are returned in json format', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog contains id field', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert.ok(blog.id, 'Blog does not contain id field')
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: 'How to write good tests',
                author: 'Robert C. Martin',
                url: 'https://www.google.com',
                likes: 11,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(n => n.title)
            assert(titles.includes('How to write good tests'))
        })

        test('succeeds if likes is missing, setting it by default to 0', async () => {
            const newBlog = {
                title: 'Testing without likes',
                author: 'Robert C. Martin',
                url: 'https://www.google.com',
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: 'Robert C. Martin',
                url: 'https://www.google.com',
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: 'Testing without likes',
                author: 'Robert C. Martin',
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .delete(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })

    describe('updating a blog', () => {
        test('succeeds with valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const newBlog = {
                title: 'Updated blog',
                author: 'New author',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 500
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()

            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes(newBlog.title))
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .put(`/api/blogs/${invalidId}`)
                .expect(400)
        })

        test('fails with statuscode 404 if note does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .put(`/api/notes/${validNonexistingId}`)
                .expect(404)
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})