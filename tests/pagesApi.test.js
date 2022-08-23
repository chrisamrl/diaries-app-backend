/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Page = require('../models/page');
const User = require('../models/user');

const { initialPages, initialUsers } = require('./pagesApiTestData');

const api = supertest(app);
let token1; let token2;

beforeEach(async () => {
  await User.deleteMany({});
  await Page.deleteMany({});

  initialUsers[0].isNew = true;
  await initialUsers[0].save();
  const login1 = await api
    .post('/login')
    .send({
      username: initialUsers[0].username,
      password: '1111',
    });
  token1 = login1.body.token;

  initialUsers[1].isNew = true;
  await initialUsers[1].save();

  const login2 = await api
    .post('/login')
    .send({
      username: initialUsers[0].username,
      password: '1111',
    });

  token2 = login2.body.token;
});

test('Add a page through api', async () => {
  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token1}`)
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

test('Add multiples pages through api', async () => {
  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token1}`)
    .send(initialPages[0])
    .expect(201);

  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token2}`)
    .send(initialPages[1])
    .expect(201);

  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token2}`)
    .send(initialPages[2])
    .expect(201);

  const response = await api.get('/pages');
  const pages = response.body;

  expect(pages).toHaveLength(3);

  const pageContent = pages.map((page) => page.content);
  expect(pageContent).toContain(initialPages[0].content);
});

test('Update page through api', async () => {
  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token1}`)
    .send(initialPages[0])
    .expect(201);

  const response = await api.get('/pages');
  const pages = response.body;

  expect(pages).toHaveLength(1);
  expect(pages[0].songApiId).toBe(initialPages[0].songApiId);
  expect(pages[0].content).toBe(initialPages[0].content);
  expect(pages[0].mood).toBe(initialPages[0].mood);

  await api
    .patch('/pages')
    .send({
      songApiId: 999,
      content: 'updated',
      mood: 'BAD',
      pageId: pages[0]._id,
    });

  const responseUpdated = await api.get('/pages');
  const pagesUpdated = responseUpdated.body;

  expect(pages).toHaveLength(1);
  expect(pagesUpdated[0].songApiId).toBe(999);
  expect(pagesUpdated[0].content).toBe('updated');
  expect(pagesUpdated[0].mood).toBe('BAD');
});

test('Added page are associated to corresponding user', async () => {
  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token1}`)
    .send(initialPages[0])
    .expect(201);

  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token2}`)
    .send(initialPages[1])
    .expect(201);

  await api
    .post('/pages')
    .set('Authorization', `Bearer ${token2}`)
    .send(initialPages[2])
    .expect(201);

  const response1 = await api.get(`/users/${initialUsers[0]._id}/pages`);
  const response2 = await api.get(`/users/${initialUsers[1]._id}/pages`);

  const pages1 = response1.body;
  const pages2 = response2.body;

  expect(pages1).toHaveLength(1);
  expect(pages1[0].songApiId).toBe(initialPages[0].songApiId);
  expect(pages1[0].content).toBe(initialPages[0].content);
  expect(pages1[0].mood).toBe(initialPages[0].mood);

  expect(pages2).toHaveLength(2);
  expect(pages2[0].songApiId).toBe(initialPages[1].songApiId);
  expect(pages2[0].content).toBe(initialPages[1].content);
  expect(pages2[0].mood).toBe(initialPages[1].mood);

  expect(pages2[1].songApiId).toBe(initialPages[2].songApiId);
  expect(pages2[1].content).toBe(initialPages[2].content);
  expect(pages2[1].mood).toBe(initialPages[2].mood);
});

afterAll(() => {
  mongoose.connection.close();
});
