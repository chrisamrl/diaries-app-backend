const bcrypt = require('bcrypt');
const User = require('../models/user');

const initialUsers = [
  new User({
    name: 'user1',
    username: 'user1',
    passwordHash: bcrypt.hashSync('1111', 10),
    pages: [],
  }),
  new User({
    name: 'user2',
    username: 'user2',
    passwordHash: bcrypt.hashSync('2222', 10),
    pages: [],
  }),
];

const initialPages = [
  {
    songApiId: 100,
    content: 'test 1',
    date: new Date('2022-01-01'),
    mood: 'GOOD',
    userId: initialUsers[0]._id,
  },
  {
    songApiId: 200,
    content: 'test 2',
    date: new Date('2022-02-02'),
    mood: 'BAD',
    userId: initialUsers[1]._id,
  },
  {
    songApiId: 300,
    content: 'test 3',
    date: new Date('2022-03-03'),
    mood: 'NEUTRAL',
    userId: initialUsers[1]._id,
  },
];

module.exports = { initialPages, initialUsers };
