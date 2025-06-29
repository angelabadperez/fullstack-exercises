const lodash = require('lodash')

const dummy = (blogs) => { 
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authorBlogsCount = lodash.countBy(blogs, 'author')
    const mostBlogsAuthor = lodash.maxBy(Object.keys(authorBlogsCount), (author) => authorBlogsCount[author])
    return {
        author: mostBlogsAuthor,
        blogs: authorBlogsCount[mostBlogsAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    const authorLikesCount = lodash.reduce(blogs, (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes
        return result
    }, {})
    const mostLikesAuthor = lodash.maxBy(Object.keys(authorLikesCount), (author) => authorLikesCount[author])
    return {
        author: mostLikesAuthor,
        likes: authorLikesCount[mostLikesAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}