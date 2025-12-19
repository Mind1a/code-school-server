const { default: mongoose } = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    realLifeExample: { type: String, required: true },
    imageUrl: { type: String },
    task: { type: String, required: true },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TocSection',
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
