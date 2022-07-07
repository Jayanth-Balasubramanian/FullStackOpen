const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const lodash = require('lodash');
const {initialBlogs, nonExistingId, blogsInDb} = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 10000);

describe('when there are some blogs initially saved', () => {
  test('api returns notes in JSON format', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
  });

  test('api returns correct number of blogs', async () => {
    const response = await api.get('/api/blogs');
    const receivedBlogs = response.body.map((r) =>
      lodash.pick(r, ['title', 'author', 'url', 'likes']));
    receivedBlogs.forEach((blog) => expect(initialBlogs).toContainEqual(blog));
  });

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe('saving a new blog', () => {
  test('succeeds when the blog is valid', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    };
    await api.post('/api/blogs').send(newBlog).expect(201);
    const updatedBlogs = await blogsInDb();
    expect(updatedBlogs.length).toEqual(initialBlogs.length + 1);
    expect(lodash.pick(updatedBlogs[initialBlogs.length],
        ['title', 'author', 'url', 'likes'])).toEqual(newBlog);
  });

  test('fails with status code 400 if title or url is missing', async () => {
    const malformedBlog = lodash.pick(initialBlogs[0], ['author', 'likes']);
    await api.post('/api/blogs' ).send(malformedBlog).expect(400);
  });

  test('number of likes defaults to 0 if not provided', async () => {
    const blogWithoutLikes = lodash.pick(initialBlogs[0],
        ['title', 'author', 'url']);
    const response = await api.post('/api/blogs').send(blogWithoutLikes);
    expect(response.body.likes).toEqual(0);
  });
});

describe('deletion of a note', () => {
  test('with a valid id works', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];
    console.log(blogToDelete);
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });
});

describe('changing a note', () => {
  test('using a valid id works', async () => {
    const blogAtStart = await blogsInDb();
    const changedBlog = {
      ...blogAtStart[0], likes: 5,
    };
    api.put(`/api/blogs/${changedBlog.id}`, changedBlog).expect(200);
    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toContainEqual(changedBlog);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
