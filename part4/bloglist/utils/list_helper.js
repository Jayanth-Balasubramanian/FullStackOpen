const lodash = require('lodash');
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((partialSum, next) => partialSum + next.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0? {}: lodash.pick(lodash.maxBy(blogs, 'likes'),
      ['title', 'author', 'likes']);
};

const mostBlogs = (blogs) => {
  return blogs.length === 0? {} : lodash.maxBy(
      lodash.map(lodash.groupBy(blogs, 'author'),
          (value, key) => ({
            'author': key, 'blogs': value.length,
          })), 'blogs');
};

const mostLikes = (blogs) => {
  return blogs.length === 0? {} : lodash.maxBy(
      lodash.map(lodash.groupBy(blogs, 'author'),
          (value, key) => ({
            'author': key, 'likes': totalLikes(value),
          })), 'likes');
};

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes};

