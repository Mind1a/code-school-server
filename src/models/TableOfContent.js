const { default: mongoose } = require('mongoose');

const TocItemSchemaema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  section: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TocSection',
      },
    ],
    default: [],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const TableOfContent = mongoose.model('TableOfContent', TocItemSchemaema);
module.exports = TableOfContent;
