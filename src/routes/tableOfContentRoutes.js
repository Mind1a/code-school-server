const express = require('express');
const {
  getToc,
  createToc,
  getTocById,
  updateToc,
  deleteTocById,
} = require('../controllers/TableOfContentsController');

const tocRoutes = express.Router();

tocRoutes.get('/toc', getToc);
tocRoutes.post('/toc', createToc);
tocRoutes.get('/toc/:id', getTocById);
tocRoutes.patch('/toc/:id', updateToc);
tocRoutes.delete('/toc/:id', deleteTocById);

module.exports = { tocRoutes };
