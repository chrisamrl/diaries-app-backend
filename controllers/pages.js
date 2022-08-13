const { ObjectId } = require('mongoose').Types;
const pagesRouter = require('express').Router();

const Page = require('../models/page');
const User = require('../models/user');

pagesRouter.get('/', async (req, res) => {
  const pages = await Page.find({});
  return res.json(pages);
});

pagesRouter.post('/', async (req, res) => {
  const {
    songApiId, content, date, mood, user,
  } = req.body;

  const associatedUser = await User.findById(ObjectId(user));

  const page = new Page({
    songApiId,
    content,
    date,
    mood,
    user,
  });

  const newPage = await page.save();

  console.log(associatedUser.pages);

  associatedUser.pages = associatedUser.pages.concat(newPage._id);
  await associatedUser.save();

  return res.status(201).json(newPage);
});

module.exports = pagesRouter;
