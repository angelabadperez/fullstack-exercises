const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog returns that', () => {
    const favoriteBlog = {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }

    assert.deepStrictEqual(listHelper.favoriteBlog([favoriteBlog]), favoriteBlog)
  })

  test('of a bigger list is calculated right', () => {
    const favoriteBlog = {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 25,
        __v: 0
    }
    const biggerList = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Problematic',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 10,
            __v: 0
        },
        favoriteBlog,
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Invalid',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 1,
            __v: 0
        }
    ]
    assert.deepStrictEqual(listHelper.favoriteBlog(biggerList), favoriteBlog)
  })
})