const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.json(users);
};

const addUser = async (req, res) => {
  const { name, username, password } = req.body;

  if (await User.findOne({ username })) {
    return res.status(400).json({
      error: 'user with given username already exists',
    });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    username,
    passwordHash,
  });

  const newUser = await user.save();

  return res.status(201).json(newUser);
};

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getUserPages = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('pages');

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (decodedToken.id !== userId) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }
  if (!user) {
    return res.status(404).json({
      message: 'user not found',
    });
  }

  // Return all pages belonging to user
  if (Object.keys(req.query).length === 0) {
    return res.json(user.pages);
  }

  const { date } = req.query;

  const filteredPage = user.pages.find((page) => page.date.getTime() === new Date(date).getTime());

  return res.json(filteredPage);
};

module.exports = { getUsers, addUser, getUserPages };
