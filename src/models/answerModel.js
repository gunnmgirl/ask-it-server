import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AnswerSchema = new Schema(
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
