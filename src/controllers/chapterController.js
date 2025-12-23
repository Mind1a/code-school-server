const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { uploadToCloudinary } = require('../lib/cloudinaryUpload');
const Chapter = require('../models/Chapter');
const TableOfContent = require('../models/TableOfContent');

const createChapter = asyncHandler(async (req, res) => {
  const {
    chapterNumber,
    chapterTitle,
    subTitle,
    description,
    task,
    tocId,
    realLifeExample,
    codingExample,
  } = req.body;

  if (
    chapterNumber === undefined ||
    !chapterTitle ||
    !subTitle ||
    !description ||
    !task ||
    !tocId ||
    !realLifeExample ||
    !codingExample
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        'chapterNumber, chapterTitle, subTitle, description, codingExample, task, realLifeExample, tocId are required',
    });
  }

  let imageUrl = null;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'codeSchool/album');
    imageUrl = result.secure_url;
  }

  const toc = await TableOfContent.findById(tocId);
  if (!toc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }

  const chapter = await Chapter.create({
    chapterNumber,
    chapterTitle,
    subTitle,
    description,
    task,
    tocId,
    imageUrl,
    realLifeExample,
    codingExample,
  });

  toc.chapter.push(chapter._id);
  await toc.save();

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

  const chapter = await Chapter.findById(id).populate({
    path: 'homework',
    options: { sort: { order: 1 } },
  });

  if (!chapter) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Chapter not found' });
  }

  const toc = await TableOfContent.findById(chapter.tocId).populate({
    path: 'chapter',
    options: { sort: { chapterNumber: 1 } },
  });

  if (!toc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'TableOfContent not found' });
  }

  const chapters = toc.chapter;
  const currentIndex = chapters.findIndex((ch) => ch._id.toString() === id);

  res.status(StatusCodes.OK).json({
    chapter,
    prevChapter: chapters[currentIndex - 1]?._id ?? null,
    nextChapter: chapters[currentIndex + 1]?._id ?? null,
    page: currentIndex + 1,
    totalPages: chapters.length,
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
    tocId,
    realLifeExample,
    codingExample,
  } = req.body;

  if (chapterNumber !== undefined) chapter.chapterNumber = chapterNumber;
  if (chapterTitle !== undefined) chapter.chapterTitle = chapterTitle;
  if (subTitle !== undefined) chapter.subTitle = subTitle;
  if (description !== undefined) chapter.description = description;
  if (task !== undefined) chapter.task = task;
  if (tocId !== undefined) chapter.tocId = tocId;
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
