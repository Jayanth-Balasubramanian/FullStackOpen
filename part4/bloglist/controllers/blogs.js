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

blogsRouter.delete('/:id', async (request, response) => {
  const {id} = request.params;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  if (request.params.likes) {
    const res = await Blog.findByIdAndUpdate(request.params.id,
        request.body, {new: true});
    response.json(res);
  }
});
module.exports = blogsRouter;
