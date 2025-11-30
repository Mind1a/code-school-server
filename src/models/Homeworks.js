const { default: mongoose } = require('mongoose');

const HomeworkSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    question: { type: String, required: true },
    help: { type: String },
    correctAnswer: { type: String, required: true },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TocSection',
      required: true,
    },
  },
  { timestamps: true }
);

const Homework = mongoose.model('Homework', HomeworkSchema);
module.exports = Homework;
