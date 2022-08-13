const usersRouter = require('express').Router();

const { getUsers, addUser, getUserPages } = require('./controllers/usersController');

usersRouter.get('/', getUsers);
usersRouter.post('/', addUser);
usersRouter.get('/:userId/pages', getUserPages);

module.exports = usersRouter;
