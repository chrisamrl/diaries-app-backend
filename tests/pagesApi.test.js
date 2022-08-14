/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Page = require('../models/page');
const User = require('../models/user');

const { initialPages, initialUsers } = require('./pagesApiTestData');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Page.deleteMany({});
  initialUsers.forEach((user) => user.save());
});

test('can add a page through api', async () => {
  await api
    .post('/pages')
    .send(initialPages[0])
    .expect(201);

  const response = await api.get('/pages');
  const pages = response.body;

  expect(pages).toHaveLength(1);

  const page = pages[0];
  expect(page.songApiId).toBe(initialPages[0].songApiId);
  expect(page.content).toBe(initialPages[0].content);
  expect(page.mood).toBe(initialPages[0].mood);
});

afterAll(() => {
  mongoose.connection.close();
});
