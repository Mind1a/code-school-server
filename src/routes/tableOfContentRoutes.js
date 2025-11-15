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
tocRoutes.get('/toc/:tocId', getTocById);
tocRoutes.patch('/toc/:tocId', updateToc);
tocRoutes.delete('/toc/:tocId', deleteTocById);

module.exports = { tocRoutes };
