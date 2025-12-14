const express = require('express');
const upload = require('../middlewares/upload');
const {
  getCourse,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const courseRoutes = express.Router();

courseRoutes.get('/courses', getCourse);
courseRoutes.post('/courses', upload.single('projectPicture'), createCourse);
courseRoutes.get('/courses/:courseId', getCourseById);
courseRoutes.patch(
  '/courses/:courseId',
  upload.single('projectPicture'),
  updateCourse
);
courseRoutes.delete('/courses/:courseId', deleteCourse);

module.exports = { courseRoutes };
