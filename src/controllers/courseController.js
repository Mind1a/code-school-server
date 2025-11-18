const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { uploadToCloudinary } = require('../lib/cloudinaryUpload');
const Course = require('../models/Course');

const createCourse = asyncHandler(async (req, res) => {
  const { name, author, sectionCount, description } = req.body;

  if (!name || !author || !sectionCount) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('name, author, and sectionCount are required');
  }

  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course picture is required');
  }

  const existedCourse = await Course.findOne({ name });
  if (existedCourse) {
    res.status(StatusCodes.CONFLICT);
    throw new Error('This course already exists');
  }

  const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');

  const course = await Course.create({
    name,
    author,
    sectionCount,
    description,
    projectPicture: result.secure_url,
    tableOfContent: [],
  });

  res.status(StatusCodes.CREATED).json(course);
});

const getCourse = asyncHandler(async (_, res) => {
  const courses = await Course.find().populate({
    path: 'tableOfContent',
    populate: {
      path: 'section',
    },
  });
  res.status(StatusCodes.OK).json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate({
    path: 'tableOfContent',
    populate: {
      path: 'section',
      populate: [{ path: 'chapter' }, { path: 'homework' }],
    },
  });
  if (!course) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }

  res.status(StatusCodes.OK).json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course ID is required');
  }

  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }

  res.status(StatusCodes.OK).json({ message: 'Course removed' });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { name, author, sectionCount, description } = req.body;

  if (!courseId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Course ID is required' });
  }

  const update = {};
  if (name !== undefined) update.name = name;
  if (author !== undefined) update.author = author;
  if (sectionCount !== undefined) update.sectionCount = sectionCount;
  if (description !== undefined) update.description = description;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');
    update.projectPicture = result.secure_url;
  }

  const updatedCourse = await Course.findByIdAndUpdate(courseId, update, {
    new: true,
    runValidators: true,
  });

  if (!updatedCourse) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }

  res.status(StatusCodes.OK).json(updatedCourse);
});

module.exports = {
  createCourse,
  getCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
