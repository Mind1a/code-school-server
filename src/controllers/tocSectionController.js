const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const TocSection = require('../models/TocSection');
const TableOfContent = require('../models/TableOfContent');
const Chapter = require('../models/Chapter');
const Homework = require('../models/Homeworks');

const createTocSection = asyncHandler(async (req, res) => {
  const { order, title, tocId } = req.body;

  if (!order || !title || !tocId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'order, tocId and title are required' });
  }

  const toc = await TableOfContent.findById(tocId);
  if (!toc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'tableOfContent not found' });
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
    tocId,
  });
  toc.section.push(tocSection._id);
  await toc.save();
  res.status(StatusCodes.CREATED).json(tocSection);
});

const getTocSection = asyncHandler(async (_, res) => {
  const allTocSection = await TocSection.find().populate('chapter');
  res.status(StatusCodes.OK).json(allTocSection);
});

const getTocSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tocSection = await TocSection.findById(id).populate('chapter');
  if (!tocSection) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TocSection not found' });
  }

  res.json(tocSection);
});

const deleteTocSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tocSection = await TocSection.findById(id);
  if (!tocSection) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }
  if (tocSection.chapter.length > 0) {
    await Chapter.deleteMany({ _id: { $in: tocSection.chapter } });
  }
  if (tocSection.homework.length > 0) {
    await Homework.deleteMany({ _id: { $in: tocSection.homework } });
  }
  await tocSection.deleteOne();
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
