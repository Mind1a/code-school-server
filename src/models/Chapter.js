// models/Chapter.js
import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    chapterNumber: { type: String, required: true }, // e.g. "2.2"
    chapterTitle: { type: String, required: true }, // e.g. "HTML-ის საფუძვლები"
    chapterIndex: { type: Number, required: true }, // e.g. 2
    sections: [
      {
        subTitle: String,
        description: String,
        imageUrl: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Chapter', ChapterSchema);
