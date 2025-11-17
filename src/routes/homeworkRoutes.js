const express = require('express');
const {
  createHomework,
  getHomeworks,
  getHomeworkById,
  updateHomework,
  deleteHomeworkById,
} = require('../controllers/homeworkController');

const homeworkRoutes = express.Router();

homeworkRoutes.get('/homeworks', getHomeworks);

homeworkRoutes.post('/homeworks', createHomework);

homeworkRoutes.get('/homeworks/:id', getHomeworkById);

homeworkRoutes.patch('/homeworks/:id', updateHomework);

homeworkRoutes.delete('/homeworks/:id', deleteHomeworkById);

module.exports = { homeworkRoutes };
