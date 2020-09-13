import Question from "../models/questionModel";
import Answer from "../models/answerModel";
import User from "../models/userModel";

async function upvoteQuestion(req, res, next) {
  const { questionId } = req.body;
  try {
    const isDownvoted = await Question.findOne({
      _id: questionId,
      "downvotes.users": req.userId,
    });
    if (isDownvoted) {
      const question = await Question.findOneAndUpdate(
        { _id: questionId },
        {
          $inc: { "downvotes.count": -1, "upvotes.count": 1 },
          $pull: { "downvotes.users": req.userId },
          $push: { "upvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        upvotes: question.upvotes.count,
        downvotes: question.downvotes.count,
        questionId,
      });
    }
    const isUpvoted = await Question.findOne({
      _id: questionId,
      "upvotes.users": req.userId,
    });
    if (isUpvoted) {
      const question = await Question.findOneAndUpdate(
        { _id: questionId },
        {
          $inc: { "upvotes.count": -1 },
          $pull: { "upvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        upvotes: question.upvotes.count,
        downvotes: question.downvotes.count,
        questionId,
      });
    }
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      { $inc: { "upvotes.count": 1 }, $push: { "upvotes.users": req.userId } },
      { new: true }
    );
    return res.status(200).send({
      upvotes: question.upvotes.count,
      downvotes: question.downvotes.count,
      questionId,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function downvoteQuestion(req, res, next) {
  const { questionId } = req.body;
  try {
    const isUpvoted = await Question.findOne({
      _id: questionId,
      "upvotes.users": req.userId,
    });
    if (isUpvoted) {
      const question = await Question.findOneAndUpdate(
        { _id: questionId },
        {
          $inc: { "upvotes.count": -1, "downvotes.count": 1 },
          $pull: { "upvotes.users": req.userId },
          $push: { "downvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        upvotes: question.upvotes.count,
        downvotes: question.downvotes.count,
        questionId,
      });
    }
    const isDownvoted = await Question.findOne({
      _id: questionId,
      "downvotes.users": req.userId,
    });
    if (isDownvoted) {
      const question = await Question.findOneAndUpdate(
        { _id: questionId },
        {
          $inc: { "downvotes.count": -1 },
          $pull: { "downvotes.users": req.userId },
        },
        { new: true }
      );
      return res.status(200).send({
        upvotes: isDownvoted.upvotes.count,
        downvotes: isDownvoted.downvotes.count,
        questionId,
      });
    }
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $inc: { "downvotes.count": 1 },
        $push: { "downvotes.users": req.userId },
      },
      { new: true }
    );
    return res.status(200).send({
      upvotes: question.upvotes.count,
      downvotes: question.downvotes.count,
      questionId,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getLatestQuestions(req, res, next) {
  const { page } = req.query;
  try {
    const totalQuestions = await Question.find().countDocuments();
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(Number(page) * 20)
      .limit(20);
    return res.status(200).send({ questions, totalQuestions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getHotQuestions(req, res, next) {
  const { page } = req.query;
  try {
    const totalQuestions = await Question.find().countDocuments();
    const questions = await Question.find()
      .sort({ upvotes: -1 })
      .skip(Number(page) * 20)
      .limit(20);
    return res.status(200).send({ questions, totalQuestions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getQuestionAndAnswers(req, res, next) {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    const answers = await Answer.find().where("_id").in(question.answers);
    return res.status(200).send({ question, answers });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getMyQuestions(req, res, next) {
  const { page } = req.query;
  try {
    const totalQuestions = await Question.find({ createdBy: req.userId });
    const questions = await Question.find({ createdBy: req.userId })
      .skip(Number(page) * 20)
      .limit(20);
    return res.status(200).send({ questions, totalQuestions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function postQuestion(req, res, next) {
  const { values } = req.body;
  try {
    const question = await Question.create({
      body: values.body,
      upvotes: 0,
      downvotes: 0,
      createdBy: req.userId,
    });
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { questions: question } }
    );
    res.status(200).send(question);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default {
  getLatestQuestions,
  getHotQuestions,
  getQuestionAndAnswers,
  postQuestion,
  getMyQuestions,
  upvoteQuestion,
  downvoteQuestion,
};
