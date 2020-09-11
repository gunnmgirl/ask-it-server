import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    upvotes: {
      count: { type: Number, default: 0 },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    downvotes: {
      count: { type: Number, default: 0 },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
