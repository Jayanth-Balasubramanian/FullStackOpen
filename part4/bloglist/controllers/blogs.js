const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const {userExtractor} = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const Blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
  response.json(Blogs);
});

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'});
  }
  const user = request.user;
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const {id} = request.params;
  const blogToDelete = await Blog.findById(id);
  const user = request.user;
  if (blogToDelete.user._id.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } else {
    return response.status(401).json({'error': 'Unauthorized'});
  }
});

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const {id} = request.params;
  const user = request.user;
  const blogToUpdate = await Blog.findById(id);
  if (blogToUpdate.user._id.toString() === user._id.toString()) {
    const {body} = request;

    if (body.likes) {
      const res = await Blog.findByIdAndUpdate(id,
          request.body, {new: true});
      response.json(res);
    }
  } else {
    response.status(401).json({'error': 'Unauthorized'});
  }
});
module.exports = blogsRouter;
