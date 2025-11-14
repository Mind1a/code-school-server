const { default: mongoose } = require('mongoose');

const TocSectionSchemaema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
});

export default mongoose.model('TocSection', TocSectionSchemaema);
