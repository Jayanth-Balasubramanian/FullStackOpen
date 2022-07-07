const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const Blogs = await Blog.find({});
  response.json(Blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  });

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
