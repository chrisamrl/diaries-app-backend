// Only for initial setup (since login is not implemented yet),
// need to manually convert string to ObjectId
const { ObjectId } = require('mongoose').Types;

const Page = require('../../models/page');
const User = require('../../models/user');

const getPages = async (req, res) => {
  const pages = await Page.find({});
  return res.json(pages);
};

const addPage = async (req, res) => {
  const {
    songApiId, content, date, mood, userId,
  } = req.body;

  const associatedUser = await User.findById(ObjectId(userId));

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
    { _id: ObjectId(pageId) },
    {
      $set: { songApiId, content, mood },
    },
  );

  return res.status(200).json({ message: 'Note updated' });
};

module.exports = { getPages, addPage, updatePage };
