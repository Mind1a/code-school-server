const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { uploadToCloudinary } = require('../lib/cloudinaryUpload');
const { default: Course } = require('../models/Course');

const createCourse = asyncHandler(async (req, res) => {
  const { name, author, sectionCount, description, image } = req.body;
  if (!name || !author || !sectionCount || !image) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('name, author, sectionCount, and courseImage are required');
  }
  const existedCourse = await Course.findOne({ name });
  if (existedCourse) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('sorry this course already exist');
  }
  let courseImage = '';
  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course picture is required');
  }
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');
    courseImage = result.secure_url;
  }
  const course = await Course.create({
    name,
    author,
    sectionCount,
    description,
    image: courseImage,
  });
  await course.save();
  res.status(StatusCodes.CREATED).json(course);
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.find();
  res.status(StatusCodes.OK).json(course);
});

const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course ID is required');
  }
  const course = await Course.findById(id);
  if (!course) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }
  res.status(StatusCodes.OK).json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course ID is required');
  }

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }

  res.status(StatusCodes.OK).json({
    message: 'course removed',
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, author, sectionCount, description, image } = req.body;

  if (!id) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Course ID is required');
  }

  const update = {};

  if (name) update.name = name;
  if (author) update.author = author;
  if (sectionCount) update.sectionCount = sectionCount;
  if (description) update.description = description;
  if (image) update.image = image;

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Project not found');
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
