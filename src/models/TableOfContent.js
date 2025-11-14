const { default: mongoose } = require('mongoose');

const TocItemSchemaema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
});

export default mongoose.model('TableOfContent', TocItemSchemaema);
