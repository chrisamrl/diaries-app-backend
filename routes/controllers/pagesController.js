const jwt = require('jsonwebtoken');
const Page = require('../../models/page');
const User = require('../../models/user');

const getPages = async (req, res) => {
  const pages = await Page.find({});
  return res.json(pages);
};

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const addPage = async (req, res) => {
  const {
    songApiId, content, date, mood, userId,
  } = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (decodedToken.id !== userId) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  const associatedUser = await User.findById(userId);

  const page = new Page({
    songApiId,
    content,
    date: new Date(date),
    mood,
    user: associatedUser._id,
  });

  const savedPage = await page.save();

  associatedUser.pages = associatedUser.pages.concat(savedPage._id);
  await associatedUser.save();

  return res.status(201).json(savedPage);
};

const updatePage = async (req, res) => {
  const {
    songApiId, content, mood, pageId,
  } = req.body;

  await Page.updateOne(
    { _id: pageId },
    {
      $set: {
        songApiId,
        content,
        mood,
      },
    },
  );

  return res.status(200).json({ message: 'Note updated' });
};

module.exports = { getPages, addPage, updatePage };
