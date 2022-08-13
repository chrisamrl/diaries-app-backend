const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const usersRouter = require('./routes/users');
const pagesRouter = require('./routes/pages');

const app = express();

app.use(express.json());

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((e) => {
    console.log('Error', e.message);
  });

app.use('/users', usersRouter);
app.use('/pages', pagesRouter);

app.get('/', (req, res) => {
  res.send('Test');
});

module.exports = app;
