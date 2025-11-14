const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { default: TableOfContent } = require('../models/TableOfContent');

const createToc = asyncHandler(async (req, res) => {
  const { order, title } = req.body;

  if (!order || !title) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'order and title are required' });
  }

  const existingToc = await TableOfContent.findOne({ title });
  if (existingToc) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'tableOfContent already exists' });
  }

  const toc = await TableOfContent.create({
    order,
    title,
  });
  await toc.save();
  res.status(StatusCodes.CREATED).json(toc);
});

const getToc = asyncHandler(async (_, res) => {
  const allToc = await TableOfContent.find().populate('sections');
  res.status(StatusCodes.OK).json(allToc);
});

const getTocById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const toc = await TableOfContent.findById(id).populate('sections');
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
