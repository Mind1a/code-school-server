import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    sectionCount: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Course', CourseSchema);
