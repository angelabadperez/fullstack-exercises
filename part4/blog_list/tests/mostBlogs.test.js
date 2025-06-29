const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('mostBlogs', () => {
  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has only one blog returns author', () => {
    const expectedResult = {
        author: 'Edsger W. Dijkstra',
        blogs: 1
    }
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const expectedResult = {
        author: 'Robert C. Martin',
        blogs: 3
    }
    const biggerList = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Problematic',
            author: 'Robert C. Martin',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Robert C. Martin',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 25,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 25,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 25,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Invalid',
            author: 'Robert C. Martin',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 1,
            __v: 0
        }
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(biggerList), expectedResult)
  })
})