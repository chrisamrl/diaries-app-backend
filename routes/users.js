const usersRouter = require('express').Router();

const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  if (await User.findOne({ username })) {
    return res.status(400).json({
      error: 'user with given username already exists',
    });
  }

  const user = new User({
    name,
    username,
    password,
  });

  const newUser = await user.save();

  return res.status(201).json(newUser);
});

module.exports = usersRouter;
