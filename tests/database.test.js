/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Page = require('../models/page');
const User = require('../models/user');
const { MONGODB_URI } = require('../utils/config');

const user1 = new User({
  name: 'user1',
  username: 'user1',
  passwordHash: '1111',
  pages: [],
});

const page1 = new Page({
  songApiId: 100,
  content: 'test 1',
  date: new Date('2022-01-01'),
  mood: 'GOOD',
  user: user1._id,
});

beforeAll(async () => {
  mongoose.connect(MONGODB_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Page.deleteMany({});
});

test('Can add page and user to database', async () => {
  expect(await User.find({})).toHaveLength(0);
  expect(await Page.find({})).toHaveLength(0);

  await user1.save();
  await page1.save();

  const allUsers = await User.find({});
  const allPages = await Page.find({});

  expect(allUsers).toHaveLength(1);
  expect(allPages).toHaveLength(1);
});

afterAll(() => {
  mongoose.connection.close();
});
