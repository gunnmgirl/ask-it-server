import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AnswerSchema = new Schema(
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
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
