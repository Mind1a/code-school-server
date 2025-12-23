const { default: mongoose } = require('mongoose');

const TocSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, required: true },

    tocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TableOfContent',
      required: true,
    },
  },
  { timestamps: true }
);

const TocSection = mongoose.model('TocSection', TocSectionSchema);
module.exports = TocSection;
