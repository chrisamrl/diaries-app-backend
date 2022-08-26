const jwt = require('jsonwebtoken');
const Page = require('../../models/page');
const User = require('../../models/user');
const { getTokenFromHeader } = require('../../utils/authorizationHelper');

const getPages = async (req, res) => {
  const pages = await Page.find({});
  return res.json(pages);
};

const addPage = async (req, res) => {
  const {
    songApiId, content, date, mood, userId,
  } = req.body;

  // Check that request is authorized
  const decodedToken = jwt.verify(getTokenFromHeader(req), process.env.SECRET);
  if (decodedToken.id !== userId) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  const user = await User.findById(userId);

  const page = new Page({
    songApiId,
    content,
    date: new Date(date),
    mood,
    user: user._id,
  });

  const savedPage = await page.save();

  user.pages = user.pages.concat(savedPage._id);
  await user.save();

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
