const { default: mongoose } = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    description: { type: String, required: false },
    realLifeExample: { type: String, required: false },
    codingExample: { type: String, required: false },
    imageUrl: { type: String },
    task: { type: String, required: false },
    projectTask: { type: String, required: false },
    stack: {
      type: String,
      enum: ['python', 'html'],
      required: false,
    },
    tocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TableOfContent',
      required: true,
    },
    homework: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Homework',
      },
    ],
  },
  { timestamps: true }
);

const Chapter = mongoose.model('Chapter', ChapterSchema);
module.exports = Chapter;
