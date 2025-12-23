const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { uploadToCloudinary } = require('../lib/cloudinaryUpload');
const Course = require('../models/Course');
const TableOfContent = require('../models/TableOfContent');

const allowedStacks = ['python', 'html'];

const createCourse = asyncHandler(async (req, res) => {
  const { name, author, sectionCount, description, stack } = req.body;

  if (!name || !author || !sectionCount || !stack) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('name, author, sectionCount and stack are required');
  }

  if (!allowedStacks.includes(stack.toLowerCase())) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(`Stack must be one of: ${allowedStacks.join(', ')}`);
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
    stack: stack.toLowerCase(),
    projectPicture: result.secure_url,
    tableOfContent: [],
  });

  res.status(StatusCodes.CREATED).json(course);
});

const getCourse = asyncHandler(async (_, res) => {
  const courses = await Course.find().populate({
    path: 'tableOfContent',
    select: 'order title chapter',
    options: { sort: { order: 1 } },
    populate: {
      path: 'chapter',
      select: 'chapterNumber chapterTitle homework',
      options: { sort: { chapterNumber: 1 } },
      populate: {
        path: 'homework',
        model: 'Homework',
        select: 'order question help correctAnswer chapterId',
        options: { sort: { order: 1 } },
      },
    },
  });

  res.status(StatusCodes.OK).json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate({
    path: 'tableOfContent',
    select: 'order title chapter',
    options: { sort: { order: 1 } },
    populate: {
      path: 'chapter',
      select: 'chapterNumber chapterTitle homework',
      options: { sort: { chapterNumber: 1 } },
      populate: {
        path: 'homework',
        model: 'Homework',
        select: 'order question help correctAnswer chapterId',
        options: { sort: { order: 1 } },
      },
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

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Course not found');
  }

  if (course.tableOfContent.length > 0) {
    await TableOfContent.deleteMany({ _id: { $in: course.tableOfContent } });
  }

  await course.deleteOne();
  res.status(StatusCodes.OK).json({ message: 'Course removed' });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { name, author, sectionCount, description, stack } = req.body;

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
  if (stack !== undefined) {
    if (!allowedStacks.includes(stack.toLowerCase())) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(`Stack must be one of: ${allowedStacks.join(', ')}`);
    }
    update.stack = stack.toLowerCase();
  }

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
