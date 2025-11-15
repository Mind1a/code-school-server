const express = require('express');
const {
  createTocSection,
  getTocSection,
  getTocSectionById,
  updateTocSection,
  deleteTocSectionById,
} = require('../controllers/tocSectionController');

const tocSectionRoutes = express.Router();

tocSectionRoutes.get('/tocSections', getTocSection);

tocSectionRoutes.post('/tocSections', createTocSection);

tocSectionRoutes.get('/tocSections/:id', getTocSectionById);

tocSectionRoutes.patch('/tocSections/:id', updateTocSection);

tocSectionRoutes.delete('/tocSections/:id', deleteTocSectionById);

module.exports = { tocSectionRoutes };
