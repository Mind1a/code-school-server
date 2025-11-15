const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { uploadToCloudinary } = require('../lib/cloudinaryUpload');
const Chapter = require('../models/Chapter');
const TocSection = require('../models/TocSection');

const createChapter = asyncHandler(async (req, res) => {
  const {
    chapterNumber,
    chapterTitle,
    subTitle,
    description,
    task,
    sectionId,
  } = req.body;

  if (
    !chapterNumber ||
    !chapterTitle ||
    !subTitle ||
    !description ||
    !task ||
    !sectionId
  ) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(
      'chapterNumber, chapterTitle, subTitle, description, task, sectionId are required'
    );
  }

  let imageUrl = null;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');
    imageUrl = result.secure_url;
  }

  const chapter = await Chapter.create({
    chapterNumber,
    chapterTitle,
    subTitle,
    description,
    task,
    sectionId,
    imageUrl,
  });

  const tocSection = await TocSection.findById(sectionId);
  if (!tocSection) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('TocSection not found');
  }

  tocSection.chapter.push(chapter._id);
  await tocSection.save();

  res.status(StatusCodes.CREATED).json(chapter);
});

const getChapter = asyncHandler(async (_, res) => {
  const allChapters = await Chapter.find();
  res.status(StatusCodes.OK).json(allChapters);
});

const getChapterById = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Chapter not found');
  }
  res.status(StatusCodes.OK).json(chapter);
});

const deleteChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findByIdAndDelete(req.params.id);
  if (!chapter) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Chapter not found');
  }
  res.status(StatusCodes.OK).json({ message: 'Chapter deleted successfully' });
});

const updateChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Chapter not found');
  }

  const {
    chapterNumber,
    chapterTitle,
    subTitle,
    description,
    task,
    sectionId,
  } = req.body;

  if (chapterNumber !== undefined) chapter.chapterNumber = chapterNumber;
  if (chapterTitle !== undefined) chapter.chapterTitle = chapterTitle;
  if (subTitle !== undefined) chapter.subTitle = subTitle;
  if (description !== undefined) chapter.description = description;
  if (task !== undefined) chapter.task = task;
  if (sectionId !== undefined) chapter.sectionId = sectionId;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');
    chapter.imageUrl = result.secure_url;
  }

  const updatedChapter = await chapter.save();
  res.status(StatusCodes.OK).json(updatedChapter);
});

module.exports = {
  createChapter,
  getChapter,
  getChapterById,
  deleteChapter,
  updateChapter,
};
