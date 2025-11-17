const { default: mongoose } = require('mongoose');

const TocSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  chapter: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
      },
    ],
    default: [],
  },
  homework: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Homework',
      },
    ],
    default: [],
  },
  tocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TableOfContent',
    required: true,
  },
});

const TocSection = mongoose.model('TocSection', TocSectionSchema);
module.exports = TocSection;
