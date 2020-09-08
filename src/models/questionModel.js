import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      required: true,
    },
    downvotes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;