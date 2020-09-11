import Question from "../models/questionModel";
import Answer from "../models/answerModel";
import User from "../models/userModel";

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

async function postQuestion(req, res, next) {
  const { values } = req.body;
  try {
    const question = await Question.create({
      body: values.body,
      upvotes: 0,
      downvotes: 0,
      createdBy: req.userId,
    });
    const user = await User.findById(req.userId);
    user.questions.push(question);
    await user.save();
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
};
