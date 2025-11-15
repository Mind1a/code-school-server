const { default: mongoose } = require('mongoose');

const TocItemSchemaema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const TableOfContent = mongoose.model('TableOfContent', TocItemSchemaema);
module.exports = TableOfContent;
