const { default: mongoose } = require("mongoose");

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    realLifeExample: { type: String, required: true },
    codingExample: { type: String, required: false },
    imageUrl: { type: String },
    task: { type: String, required: true },
    tocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableOfContent",
      required: true,
    },
    homework: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Homework",
      },
    ],
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", ChapterSchema);
module.exports = Chapter;
