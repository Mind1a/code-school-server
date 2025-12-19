const { default: mongoose } = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    sectionCount: { type: Number, required: true },
    description: { type: String },
    projectPicture: { type: String },
    tableOfContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TableOfContent',
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
