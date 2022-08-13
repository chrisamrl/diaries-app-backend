const pagesRouter = require('express').Router();

const { getPages, addPage, updatePage } = require('./controllers/pagesController');

pagesRouter.get('/', getPages);

pagesRouter.post('/', addPage);

pagesRouter.patch('/', updatePage);

module.exports = pagesRouter;
