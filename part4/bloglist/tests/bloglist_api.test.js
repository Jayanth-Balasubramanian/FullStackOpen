const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const lodash = require('lodash');
const {initialBlogs, nonExistingId, blogsInDb} = require('./test_helper');
let token = null;
beforeAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const testUser = {
    'username': 'root',
    'name': 'superuser',
    'password': 'root',
  };
  await api.post('/api/users')
      .set({'Accept': 'application/json'})
      .send(testUser).expect(201)
      .expect('Content-Type', /application\/json/);
  const login = await api.post('/api/login').set({'Accept': 'application/json'})
      .send(testUser).expect(200)
      .expect('Content-Type', /application\/json/);
  token = login.body.token;
});


beforeEach(async () => {
  await Blog.deleteMany({});
  const user = await User.find({'username': 'root'});
  const blogObjects = initialBlogs.map(
      (blog) => {
        blog.user = user[0]._id;
        return new Blog(blog);
      });
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 10000);

describe('when there are some blogs initially saved', () => {
  test('api returns notes in JSON format', async () => {
    await api.get('/api/blogs').expect(200)
        .expect('Content-Type', /application\/json/);
  });

  test('api returns correct number of blogs', async () => {
    const response = await api.get('/api/blogs');
    const receivedBlogs = response.body.map((blog) =>
      lodash.pick(blog, ['title', 'author', 'url', 'likes']));
    initialBlogs.forEach((blog) => {
      expect(receivedBlogs).toContainEqual(
          lodash.pick(blog, ['title', 'author', 'url', 'likes']));
    });
  });

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => expect(blog.id).toBeDefined());
  });
});


describe('saving a new blog as an authorized user', () => {
  test('succeeds when the blog is valid', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    };
    await api.post('/api/blogs')
        .set({'Accept': 'application/json',
          'Authorization': `Bearer ${token}`})
        .send(newBlog)
        .expect(201);
    const updatedBlogs = await blogsInDb();
    expect(updatedBlogs.length).toEqual(initialBlogs.length + 1);
    expect(lodash.pick(updatedBlogs[initialBlogs.length],
        ['title', 'author', 'url', 'likes'])).toEqual(newBlog);
  });

  test('fails with status code 400 if title or url is missing', async () => {
    const malformedBlog = lodash.pick(initialBlogs[0], ['author', 'likes']);
    await api.post('/api/blogs' )
        .set({'Accept': 'application/json',
          'Authorization': `Bearer ${token}`})
        .send(malformedBlog)
        .expect(400);
  });

  test('number of likes defaults to 0 if not provided', async () => {
    const blogWithoutLikes = lodash.pick(initialBlogs[0],
        ['title', 'author', 'url']);
    const res = await api.post('/api/blogs')
        .set({'Accept': 'application/json',
          'Authorization': `Bearer ${token}`})
        .send(blogWithoutLikes);
    expect(res.body.likes).toEqual(0);
  });
});

describe('deletion of a blog as authorized user', () => {
  test('works with a valid id', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set({'Authorization': `Bearer ${token}`}).expect(204);
    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });

  test('with an invalid id returns status code 404', async () => {
    const invalidId = await nonExistingId();
    api.delete(`/api/blogs/${invalidId}`)
        .set({'Authorization': `Bearer ${token}`}).expect(404);
  });
});

describe('changing a note', () => {
  test('using a valid id works', async () => {
    const blogAtStart = await blogsInDb();
    const changedBlog = {
      ...blogAtStart[0], likes: 5,
    };
    await api.put(`/api/blogs/${changedBlog.id}`)
        .set({'Accept': 'application/json',
          'Authorization': `Bearer ${token}`})
        .send(changedBlog).expect(200);
    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toContainEqual(changedBlog);
  });
});

describe('Without a valid token', () => {
  test('deletion of a blog fails', async () => {
    blogsAtStart = await blogsInDb();
    console.log(blogsAtStart);
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });

  test('edition of a blog fails', async () => {
    blogsAtStart = await blogsInDb();
    const changedBlog = {
      ...blogsAtStart[0], likes: 5,
    };
    await api.put(`/api/blogs/${changedBlog.id}`)
        .send(changedBlog).expect(401);
  });
});


afterAll(() => {
  mongoose.connection.close();
});
