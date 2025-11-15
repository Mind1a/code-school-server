const { default: mongoose } = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    task: { type: String, required: true },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TocSection',
      required: true,
    },
  },
  { timestamps: true }
);

const Chapter = mongoose.model('Chapter', ChapterSchema);
module.exports = Chapter;
