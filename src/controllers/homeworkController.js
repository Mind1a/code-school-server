const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Homework = require('../models/Homeworks');
const TocSection = require('../models/TocSection');

const createHomework = asyncHandler(async (req, res) => {
  const { order, question, help, correctAnswer, sectionId } = req.body;

  if (!order || !question || !correctAnswer || !sectionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'order, question, correctAnswer and sectionId are required',
    });
  }

  const existingHomework = await Homework.findOne({ question, sectionId });
  if (existingHomework) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'Homework already exists in this section' });
  }

  const homework = await Homework.create({
    order,
    question,
    help,
    correctAnswer,
    sectionId,
  });

  const section = await TocSection.findById(sectionId);
  section.homework.push(homework._id);
  await section.save();
  res.status(StatusCodes.CREATED).json(homework);
});

const getHomeworks = asyncHandler(async (_, res) => {
  const allHomeworks = await Homework.find();
  res.status(StatusCodes.OK).json(allHomeworks);
});

const getHomeworkById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const homework = await Homework.findById(id);
  if (!homework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  res.json(homework);
});

const deleteHomeworkById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const homework = await Homework.findByIdAndDelete(id);

  if (!homework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  res.status(StatusCodes.OK).json({ message: 'Homework deleted' });
});

// UPDATE
const updateHomework = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { order, question, help, correctAnswer, sectionId } = req.body;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'id is required' });
  }

  if (
    order === undefined &&
    question === undefined &&
    help === undefined &&
    correctAnswer === undefined &&
    sectionId === undefined
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'at least one field must be provided',
    });
  }

  const update = {};
  if (order !== undefined) update.order = order;
  if (question !== undefined) update.question = question;
  if (help !== undefined) update.help = help;
  if (correctAnswer !== undefined) update.correctAnswer = correctAnswer;
  if (sectionId !== undefined) update.sectionId = sectionId;

  const updatedHomework = await Homework.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!updatedHomework) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Homework not found' });
  }

  res.status(StatusCodes.OK).json(updatedHomework);
});

module.exports = {
  createHomework,
  getHomeworks,
  getHomeworkById,
  deleteHomeworkById,
  updateHomework,
};
