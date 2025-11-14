const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const TocSection = require('../models/TocSection');

const createTocSection = asyncHandler(async (req, res) => {
  const { order, title } = req.body;

  if (!order || !title) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'order and title are required' });
  }

  const existingTocSection = await TocSection.findOne({ title });
  if (existingTocSection) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'TocSection already exists' });
  }

  const tocSection = await TocSection.create({
    order,
    title,
  });
  await tocSection.save();
  res.status(StatusCodes.CREATED).json(tocSection);
});

const getTocSection = asyncHandler(async (_, res) => {
  const allTocSection = await TocSection.find().populate('sections');
  res.status(StatusCodes.OK).json(allTocSection);
});

const getTocSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tocSection = await TocSection.findById(id).populate('Assignment');
  if (!tocSection) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TocSection not found' });
  }

  res.json(tocSection);
});

const deleteTocSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tocSection = await TocSection.findByIdAndDelete(id);

  if (!tocSection) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }

  res.status(StatusCodes.OK).json({ message: 'table of content deleted' });
});

const updateTocSection = asyncHandler(async (req, res) => {
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

  const updatedTocSection = await TocSection.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!updatedTocSection) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'table of content not found' });
  }

  res.status(StatusCodes.OK).json(updatedTocSection);
});

module.exports = {
  createTocSection,
  getTocSection,
  getTocSectionById,
  deleteTocSectionById,
  updateTocSection,
};
