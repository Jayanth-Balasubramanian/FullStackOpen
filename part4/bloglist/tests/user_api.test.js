const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {usersInDb} = require('./test_helper');
describe('Where there is initially one username in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('helloWorld', 10);
    const user = new User({username: 'root', name: 'root',
      passwordHash: passwordHash});
    await user.save();
  });

  test('succeeds with valid user', async () => {
    const usersAtStart = await usersInDb();

    const validUser = {
      'username': 'Jayanth',
      'name': 'Jayanth',
      'password': 'helloWorld',
    };
    await api.post('/api/users').send(validUser).expect(201);
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  });

  test('fails when username is shorter than 3 characters', async () => {
    const invalidUser = {
      'username': 'ab',
      'name': 'abc',
      'password': 'password',
    };

    await api.post('/api/users').send(invalidUser).expect(400);
  });

  test('fails when password is shorter than 3 characters', async () => {
    const invalidUser = {
      'username': 'Jayanth',
      'name': 'Jayanth',
      'password': 'ab',
    };

    await api.post('/api/users').send(invalidUser).expect(400);
  });

  test('fails if username is already taken', async () => {
    const alreadyExistingUser = {
      'username': 'root',
      'name': 'root',
      'password': 'root',
    };

    const res = await api.post('/api/users').send(alreadyExistingUser);
    expect(res.body.error).toContain('expected `username` to be unique');
  });
});
