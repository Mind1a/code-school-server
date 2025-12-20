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
    realLifeExample,
    codingExample,
  } = req.body;

  if (
    chapterNumber === undefined ||
    !chapterTitle ||
    !subTitle ||
    !description ||
    !task ||
    !sectionId ||
    !realLifeExample ||
    !codingExample
  ) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(
      'chapterNumber, chapterTitle, subTitle, description, codingExample, task, realLifeExample, sectionId are required'
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
    realLifeExample,
    codingExample,
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
  const chapters = await Chapter.find().populate({
    path: 'homework',
    options: { sort: { order: 1 } },
  });

  res.status(StatusCodes.OK).json(chapters);
});

const getChapterById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chapter = await Chapter.findById(id);

  if (!chapter) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Chapter not found',
    });
  }

  const section = await TocSection.findById(chapter.sectionId).populate(
    'chapter'
  );

  if (!section) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Section not found',
    });
  }

  const sectionChapters = await Chapter.find({
    _id: { $in: section.chapter },
  }).sort({ chapterNumber: 1 });

  const currentIndex = sectionChapters.findIndex(
    (chapter) => chapter._id.toString() === id
  );

  const prevChapterId =
    currentIndex > 0 ? sectionChapters[currentIndex - 1]._id : null;

  const nextChapterId =
    currentIndex < sectionChapters.length - 1
      ? sectionChapters[currentIndex + 1]._id
      : null;

  res.status(StatusCodes.OK).json({
    chapter,
    prevChapter: prevChapterId,
    nextChapter: nextChapterId,
    page: currentIndex + 1,
    totalPages: sectionChapters.length,
  });
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
    realLifeExample,
    codingExample,
  } = req.body;

  if (chapterNumber !== undefined) chapter.chapterNumber = chapterNumber;
  if (chapterTitle !== undefined) chapter.chapterTitle = chapterTitle;
  if (subTitle !== undefined) chapter.subTitle = subTitle;
  if (description !== undefined) chapter.description = description;
  if (task !== undefined) chapter.task = task;
  if (sectionId !== undefined) chapter.sectionId = sectionId;
  if (realLifeExample !== undefined) chapter.realLifeExample = realLifeExample;
  if (codingExample !== undefined) chapter.codingExample = codingExample;

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
