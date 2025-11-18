const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const TableOfContent = require('../models/TableOfContent');
const Course = require('../models/Course');
const TocSection = require('../models/TocSection');

const createToc = asyncHandler(async (req, res) => {
  const { order, title, courseId } = req.body;

  if (!order || !title || !courseId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'order, title and courseId are required' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Course not found' });
  }

  const existingToc = await TableOfContent.findOne({ title, courseId });
  if (existingToc) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'TableOfContent already exists for this course' });
  }

  const toc = await TableOfContent.create({
    order,
    title,
    courseId,
  });

  course.tableOfContent.push(toc._id);
  await course.save();

  res.status(StatusCodes.CREATED).json(toc);
});

const getToc = asyncHandler(async (_, res) => {
  const totalSections = await TocSection.countDocuments();

  const allToc = await TableOfContent.aggregate([
    {
      $lookup: {
        from: 'tocsections',
        localField: 'section',
        foreignField: '_id',
        as: 'section',
      },
    },
    {
      $set: {
        totalSections: totalSections,
      },
    },
  ]);

  res.status(StatusCodes.OK).json(allToc);
});

const getTocById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const toc = await TableOfContent.findById(id).populate('section');
  if (!toc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }

  res.json(toc);
});

const deleteTocById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const toc = await TableOfContent.findByIdAndDelete(id);

  if (!toc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }

  res.status(StatusCodes.OK).json({ message: 'table of content deleted' });
});

const updateToc = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { order, title } = req.body;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'id is required' });
  }

  if (order === undefined && title === undefined) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'order or title must be provided' });
  }

  const update = {};
  if (order !== undefined) update.order = order;
  if (title !== undefined) update.title = title;

  const updatedToc = await TableOfContent.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!updatedToc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'table of content not found' });
  }

  res.status(StatusCodes.OK).json(updatedToc);
});

module.exports = {
  createToc,
  getToc,
  getTocById,
  deleteTocById,
  updateToc,
};
