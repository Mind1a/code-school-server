const { default: mongoose } = require('mongoose');

const TocItemSchemaema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    chapter: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chapter',
        },
      ],
      default: [],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true }
);

const TableOfContent = mongoose.model('TableOfContent', TocItemSchemaema);
module.exports = TableOfContent;
