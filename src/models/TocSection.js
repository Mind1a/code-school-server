const { default: mongoose } = require('mongoose');

const TocSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});

const TocSection = mongoose.model('TocSection', TocSectionSchema);
module.exports = TocSection;
