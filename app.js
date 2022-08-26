const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');
const { errorHandler } = require('./utils/middlewares');
const config = require('./utils/config');
const usersRouter = require('./routes/users');
const pagesRouter = require('./routes/pages');
const loginRouter = require('./routes/login');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

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
app.use('/login', loginRouter);

app.use(errorHandler);

module.exports = app;
