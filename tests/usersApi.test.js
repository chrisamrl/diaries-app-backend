/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const initialUsers = [
  {
    name: 'user1',
    username: 'user1',
    password: '1111',
  },
  {
    name: 'user2',
    username: 'user2',
    password: '2222',
  },
];

const api = supertest(app);

describe('Case where database is empty', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Able to add a user', async () => {
    await api
      .post('/users')
      .send(initialUsers[0])
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const returned = await User.find({});
    const users = returned.map((u) => u.toJSON());

    expect(users).toHaveLength(1);
  });
});

describe('Case where database has one users', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    await api
      .post('/users')
      .send(initialUsers[0]);
  });

  test('NOT able to add users with different username', async () => {
    await api
      .post('/users')
      .send(initialUsers[0])
      .expect(400);

    const returned = await User.find({});
    const users = returned.map((u) => u.toJSON());

    expect(users).toHaveLength(1);
  });

  test('Able to add users with different username', async () => {
    await api
      .post('/users')
      .send(initialUsers[1])
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const returned = await User.find({});
    const users = returned.map((u) => u.toJSON());

    expect(users).toHaveLength(2);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
