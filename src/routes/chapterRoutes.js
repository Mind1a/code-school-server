const express = require('express');
const upload = require('../middlewares/upload');
const {
  createChapter,
  getChapter,
  getChapterById,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');

const chapterRoutes = express.Router();

chapterRoutes.get('/chapters', getChapter);
chapterRoutes.post('/chapters', upload.single('imageUrl'), createChapter);
chapterRoutes.get('/chapters/:id', getChapterById);
chapterRoutes.patch('/chapters/:id', upload.single('imageUrl'), updateChapter);
chapterRoutes.delete('/chapters/:id', deleteChapter);

module.exports = { chapterRoutes };
