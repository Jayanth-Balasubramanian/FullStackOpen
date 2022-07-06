const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const lodash = require('lodash');
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 10000);

test('api returns notes in JSON format', async () => {
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
});

test('api returns correct number of blogs', async () => {
  const response = await api.get('/api/blogs');
  const receivedBlogs = response.body.map((r) =>
    lodash.pick(r, ['title', 'author', 'url', 'likes']));
  expect(receivedBlogs).toEqual(initialBlogs);
});

test('unique identifier property of blogs is named id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((blog) => expect(blog.id).toBeDefined());
});

test('post request of valid blog', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  };
  await api.post('/api/blogs').send(newBlog).expect(201);
  const updatedBlogs = await Blog.find({});
  expect(updatedBlogs.length).toEqual(initialBlogs.length + 1);
  expect(lodash.pick(updatedBlogs[initialBlogs.length],
      ['title', 'author', 'url', 'likes'])).toEqual(newBlog);
});

test('400 bad response if title or url is missing', async () => {
  const malformedBlog = lodash.pick(initialBlogs[0], ['author', 'likes']);
  await api.post('/api/blogs' ).send(malformedBlog).expect(400);
});

test('number of likes defaults to 0 if not provided', async () => {
  const blogWithoutLikes = lodash.pick(initialBlogs[0],
      ['title', 'author', 'url']);
  const response = await api.post('/api/blogs').send(blogWithoutLikes);
  expect(response.body.likes).toEqual(0);
});

afterAll(() => {
  mongoose.connection.close();
});
