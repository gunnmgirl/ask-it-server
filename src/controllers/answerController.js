import Answer from "../models/answerModel";
import User from "../models/userModel";
import Question from "../models/questionModel";

async function postAnswer(req, res, next) {
  const { questionId, values } = req.body;
  try {
    const answer = await Answer.create({
      body: values.body,
      upvotes: 0,
      downvotes: 0,
      createdBy: req.userId,
    });
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      { $push: { answers: answer } }
    );
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { answers: answer } }
    );

    res.status(200).send(answer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function deleteAnswer(req, res, next) {
  const { answerId, questionId } = req.query;
  try {
    await Answer.findByIdAndDelete(answerId);
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $pull: { answers: answerId },
      },
      { new: true }
    );
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $pull: { answers: answerId },
      },
      { new: true }
    );
    res.status(200).send(answerId);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function editAnswer(req, res, next) {
  const { answerId, values } = req.body;
  try {
    await Answer.findByIdAndUpdate(answerId, { body: values.body });
    res.status(200).send({ answerId, newContent: values.body });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function upvoteAnswer(req, res, next) {
  const { answerId } = req.body;
  try {
    const isDownvoted = await Answer.findOne({
      _id: answerId,
      "downvotes.users": req.userId,
    });
    if (isDownvoted) {
      const answer = await Answer.findOneAndUpdate(
        { _id: answerId },
        {
          $inc: { "downvotes.count": -1, "upvotes.count": 1 },
          $pull: { "downvotes.users": req.userId },
          $push: { "upvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        answer,
      });
    }
    const isUpvoted = await Answer.findOne({
      _id: answerId,
      "upvotes.users": req.userId,
    });
    if (isUpvoted) {
      const answer = await Answer.findOneAndUpdate(
        { _id: answerId },
        {
          $inc: { "upvotes.count": -1 },
          $pull: { "upvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        answer,
      });
    }
    const answer = await Answer.findOneAndUpdate(
      { _id: answerId },
      { $inc: { "upvotes.count": 1 }, $push: { "upvotes.users": req.userId } },
      { new: true }
    );
    return res.status(200).send({
      answer,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function downvoteAnswer(req, res, next) {
  const { answerId } = req.body;
  try {
    const isUpvoted = await Answer.findOne({
      _id: answerId,
      "upvotes.users": req.userId,
    });
    if (isUpvoted) {
      const answer = await Answer.findOneAndUpdate(
        { _id: answerId },
        {
          $inc: { "upvotes.count": -1, "downvotes.count": 1 },
          $pull: { "upvotes.users": req.userId },
          $push: { "downvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        answer,
      });
    }
    const isDownvoted = await Answer.findOne({
      _id: answerId,
      "downvotes.users": req.userId,
    });
    if (isDownvoted) {
      const answer = await Answer.findOneAndUpdate(
        { _id: answerId },
        {
          $inc: { "downvotes.count": -1 },
          $pull: { "downvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        answer,
      });
    }
    const answer = await Answer.findOneAndUpdate(
      { _id: answerId },
      {
        $inc: { "downvotes.count": 1 },
        $push: { "downvotes.users": req.userId },
      },
      { new: true }
    );
    return res.status(200).send({
      answer,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default {
  postAnswer,
  deleteAnswer,
  editAnswer,
  downvoteAnswer,
  upvoteAnswer,
};
