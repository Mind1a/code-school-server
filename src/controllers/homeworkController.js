const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Homework = require('../models/Homeworks');
const Chapter = require('../models/Chapter');

const createHomework = asyncHandler(async (req, res) => {
  const { order, question, help, correctAnswer, chapterId } = req.body;

  if (!order || !question || !correctAnswer || !chapterId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'order, question, correctAnswer and chapterId are required',
    });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Chapter not found' });
  }

  const existingHomework = await Homework.findOne({ question, chapterId });
  if (existingHomework) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'Homework already exists in this chapter' });
  }

  const homework = await Homework.create({
    order,
    question,
    help,
    correctAnswer,
    chapterId,
  });

  chapter.homework.push(homework._id);
  await chapter.save();

  res.status(StatusCodes.CREATED).json(homework);
});

const getHomeworks = asyncHandler(async (_, res) => {
  const allHomeworks = await Homework.find().populate('chapterId');
  res.status(StatusCodes.OK).json(allHomeworks);
});

const getHomeworkById = asyncHandler(async (req, res) => {
  const homework = await Homework.findById(req.params.id).populate('chapterId');

  if (!homework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  res.status(StatusCodes.OK).json(homework);
});

const deleteHomeworkById = asyncHandler(async (req, res) => {
  const homework = await Homework.findById(req.params.id);

  if (!homework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  await Chapter.findByIdAndUpdate(homework.chapterId, {
    $pull: { homework: homework._id },
  });

  await homework.deleteOne();

  res.status(StatusCodes.OK).json({ message: 'Homework deleted' });
});

const updateHomework = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { order, question, help, correctAnswer, chapterId } = req.body;

  if (
    order === undefined &&
    question === undefined &&
    help === undefined &&
    correctAnswer === undefined &&
    chapterId === undefined
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'At least one field must be provided',
    });
  }

  const homework = await Homework.findById(id);
  if (!homework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  if (order !== undefined) homework.order = order;
  if (question !== undefined) homework.question = question;
  if (help !== undefined) homework.help = help;
  if (correctAnswer !== undefined) homework.correctAnswer = correctAnswer;

  if (
    chapterId !== undefined &&
    chapterId.toString() !== homework.chapterId.toString()
  ) {
    await Chapter.updateMany(
      { homework: homework._id },
      { $pull: { homework: homework._id } }
    );

    const chapterExists = await Chapter.findById(chapterId);
    if (!chapterExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid Chapter ID' });
    }
    homework.chapterId = chapterId;
    await Chapter.findByIdAndUpdate(chapterId, {
      $push: { homework: homework._id },
    });
  }

  const updatedHomework = await homework.save();
  res.status(StatusCodes.OK).json(updatedHomework);
});

module.exports = {
  createHomework,
  getHomeworks,
  getHomeworkById,
  deleteHomeworkById,
  updateHomework,
};
